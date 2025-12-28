package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.ai.model.AiModerationRequest;
import com.taogexuefen.aethernet_backend.ai.model.AiModerationResponse;
import com.taogexuefen.aethernet_backend.ai.service.AiModerationService;
import com.taogexuefen.aethernet_backend.ai.service.AiPostService;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.mapper.*;
import com.taogexuefen.aethernet_backend.model.dto.PostCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.PostUpdateRequest;

import com.taogexuefen.aethernet_backend.model.entity.*;
import com.taogexuefen.aethernet_backend.model.vo.*;

import com.taogexuefen.aethernet_backend.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private PostTagMapper postTagMapper;

    @Autowired
    private PostImageMapper postImageMapper;

    @Autowired
    private LikeMapper likeMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private ModerationLogMapper moderationLogMapper;

    @Autowired
    private AiModerationService aiModerationService;

    @Autowired
    private AiPostService aiPostService;

    @Override
    @Transactional
    public Long createPost(PostCreateRequest request, Long userId) {
        // 1. 校验分类是否存在
        Category category = categoryMapper.selectById(request.getCategoryId());
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }


        // 2. 创建帖子
        Post post = new Post();
        BeanUtils.copyProperties(request, post);

        // 5. ai审核帖子
        AiModerationResponse moderate = aiModerationService.moderate(AiModerationRequest.of(
                post.getTitle(),
                post.getContent()
        ));

        if(moderate.getDecision().equals("rejected")){
            throw new RuntimeException("帖子不合规!原因为："+moderate.getReason());
        }

        post.setUserId(userId);
        post.setStatus(moderate.getDecision());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.insert(post);

        Long postId = post.getPostId();

        // 3. 处理标签
        handleTags(request.getTagIds(), request.getTagNames(), postId);

        // 4. 处理图片
        handleImages(request.getImages(), postId);


        ModerationLog moderationLog = new ModerationLog();
        moderationLog.setPostId(postId);
        moderationLog.setDecision(moderate.getDecision());
        moderationLog.setReason(moderate.getReason());
        moderationLog.setRiskLevel(moderate.getRiskLevel());
        moderationLog.setCreatedAt(LocalDateTime.now());
        moderationLogMapper.insert(moderationLog);

        return postId;
    }

    @Override
    @Transactional
    public Long updatePost(Long postId, PostUpdateRequest request, Long userId) {
        // 1. 校验帖子是否存在且属于当前用户
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("无权限编辑该帖子");
        }

        // 2. 校验分类是否存在
        Category category = categoryMapper.selectById(request.getCategoryId());
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }

        // 3. 更新帖子信息
        BeanUtils.copyProperties(request, post);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.updateById(post);

        // 4. 删除原有的标签关联关系
        LambdaQueryWrapper<PostTag> postTagWrapper = new LambdaQueryWrapper<>();
        postTagWrapper.eq(PostTag::getPostId, postId);
        postTagMapper.delete(postTagWrapper);

        // 5. 处理标签
        handleTags(request.getTagIds(), request.getTagNames(), postId);

        // 6. 删除原有的图片
        LambdaQueryWrapper<PostImage> postImageWrapper = new LambdaQueryWrapper<>();
        postImageWrapper.eq(PostImage::getPostId, postId);
        postImageMapper.delete(postImageWrapper);

        // 7. 处理图片
        handleImages(request.getImages(), postId);

        return postId;
    }

    @Override
    public Page<PostVO> getPostList(PostQueryDTO queryDTO, Long userId) {
        // 创建分页对象
        Page<Post> page = new Page<>(queryDTO.getPage(), queryDTO.getSize());
        
        // 构建查询条件
        LambdaQueryWrapper<Post> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Post::getStatus, "approved")
                .orderBy(true,false,Post::getCreatedAt); // 只查询已审核通过的帖子

        // 仅查询当前用户自己的帖子
        if (Boolean.TRUE.equals(queryDTO.getOnlyMine()) && userId != null) {
            queryWrapper.eq(Post::getUserId, userId);
        }
        
        // 分类筛选
        if (queryDTO.getCategoryId() != null) {
            queryWrapper.eq(Post::getCategoryId, queryDTO.getCategoryId());
        }
        
        // 关键词搜索
        if (StringUtils.hasText(queryDTO.getKeyword())) {
            queryWrapper.and(wrapper -> wrapper
                    .like(Post::getTitle, queryDTO.getKeyword())
                    .or()
                    .like(Post::getContent, queryDTO.getKeyword()));
        }
        
        // 排序
        switch (queryDTO.getSortBy()) {
            case "view_count":
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Post::getViewCount);
                break;
            case "like_count":
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Post::getLikeCount);
                break;
            default: // created_at
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Post::getCreatedAt);
                break;
        }
        
        // 执行分页查询
        postMapper.selectPage(page, queryWrapper);
        
        Page<PostVO> voPage = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        List<PostVO> voList = page.getRecords().stream().map(post -> {
            PostVO postVO = convertToPostVO(post);
            if (userId != null) {
                LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
                likeWrapper.eq(Like::getUserId, userId)
                        .eq(Like::getPostId, post.getPostId())
                        .isNull(Like::getCommentId);
                postVO.setIsLiked(likeMapper.selectCount(likeWrapper) > 0);
            } else {
                postVO.setIsLiked(false);
            }
            return postVO;
        }).collect(Collectors.toList());
        voPage.setRecords(voList);

        return voPage;
    }

    @Override
    @Transactional
    public PostDetailVO getPostDetail(Long postId, Long userId) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null || !"approved".equals(post.getStatus())) {
            throw new RuntimeException("帖子不存在或未审核通过");
        }
        
        // 2. 增加浏览次数
        post.setViewCount(post.getViewCount() + 1);
        postMapper.updateById(post);
        
        // 3. 转换为VO对象
        PostDetailVO postDetailVO = new PostDetailVO();
        BeanUtils.copyProperties(post, postDetailVO);
        
        // 4. 设置分类信息
        Category category = categoryMapper.selectById(post.getCategoryId());
        if (category != null) {
            CategoryVO categoryVO = new CategoryVO();
            categoryVO.setCategoryId(category.getCategoryId());
            categoryVO.setCategoryName(category.getCategoryName());
            postDetailVO.setCategory(categoryVO);
        }
        
        // 5. 设置作者信息
        // TODO: 这里需要从用户服务获取用户信息，暂时使用简单处理
        User user = userMapper.selectById(post.getUserId());
        AuthorVO authorVO = new AuthorVO();
        BeanUtils.copyProperties(user,authorVO);
        postDetailVO.setAuthor(authorVO);
        
        // 6. 设置标签信息
        List<String> tags = getPostTags(postId);
        postDetailVO.setTags(tags);
        
        // 7. 设置图片信息
        List<String> images = getPostImages(postId);
        postDetailVO.setImages(images);
        
        // 8. 设置用户点赞和收藏状态
        if (userId != null) {
            // 查询是否点赞
            LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
            likeWrapper.eq(Like::getUserId, userId)
                      .eq(Like::getPostId, postId)
                      .isNull(Like::getCommentId); // 只查询帖子的点赞，不包括评论的点赞
            postDetailVO.setIsLiked(likeMapper.selectCount(likeWrapper) > 0);
            
            // 查询是否收藏
            LambdaQueryWrapper<Favorite> favoriteWrapper = new LambdaQueryWrapper<>();
            favoriteWrapper.eq(Favorite::getUserId, userId)
                          .eq(Favorite::getPostId, postId);
            postDetailVO.setIsFavorited(favoriteMapper.selectCount(favoriteWrapper) > 0);
        }
        
        return postDetailVO;
    }

    @Override
    @Transactional
    public boolean deletePost(Long postId, Long userId) {
        // 1. 校验帖子是否存在且属于当前用户
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除该帖子");
        }

        if(post.getStatus().equals("deleted")){
            throw new RuntimeException("帖子已删除");
        }
        
        // 2. 删除帖子（逻辑删除，修改状态为已删除）
        post.setStatus("deleted");
        post.setUpdatedAt(LocalDateTime.now());
        return postMapper.updateById(post) > 0;
    }

    @Override
    @Transactional
    public LikeResult likePost(Long postId, Long userId) {
        // 1. 校验帖子是否存在
        Post post = postMapper.selectById(postId);
        if (post == null || !"approved".equals(post.getStatus())) {
            throw new RuntimeException("帖子不存在或未审核通过");
        }
        
        // 2. 查询是否已点赞
        LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
        likeWrapper.eq(Like::getUserId, userId)
                  .eq(Like::getPostId, postId)
                  .isNull(Like::getCommentId); // 只查询帖子的点赞，不包括评论的点赞
        
        Like like = likeMapper.selectOne(likeWrapper);
        
        if (like != null) {
            // 已点赞，取消点赞
            likeMapper.delete(likeWrapper);
            post.setLikeCount(post.getLikeCount() - 1);
            postMapper.updateById(post);
            
            return new LikeResult(false, post.getLikeCount());
        } else {
            // 未点赞，添加点赞
            Like newLike = new Like();
            newLike.setUserId(userId);
            newLike.setPostId(postId);
            newLike.setCreatedAt(LocalDateTime.now());
            likeMapper.insert(newLike);
            
            post.setLikeCount(post.getLikeCount() + 1);
            postMapper.updateById(post);
            
            return new LikeResult(true, post.getLikeCount());
        }
    }

    @Override
    @Transactional
    public FavoriteResult favoritePost(Long postId, Long userId) {
        // 1. 校验帖子是否存在
        Post post = postMapper.selectById(postId);
        if (post == null || !"approved".equals(post.getStatus())) {
            throw new RuntimeException("帖子不存在或未审核通过");
        }
        
        // 2. 查询是否已收藏
        LambdaQueryWrapper<Favorite> favoriteWrapper = new LambdaQueryWrapper<>();
        favoriteWrapper.eq(Favorite::getUserId, userId)
                      .eq(Favorite::getPostId, postId);
        
        Favorite favorite = favoriteMapper.selectOne(favoriteWrapper);
        
        if (favorite != null) {
            // 已收藏，取消收藏
            favoriteMapper.delete(favoriteWrapper);
            return new FavoriteResult(false);
        } else {
            // 未收藏，添加收藏
            Favorite newFavorite = new Favorite();
            newFavorite.setUserId(userId);
            newFavorite.setPostId(postId);
            newFavorite.setCreatedAt(LocalDateTime.now());
            favoriteMapper.insert(newFavorite);
            
            return new FavoriteResult(true);
        }
    }

    @Override
    public Page<FavoriteVO> getFavorites(Integer page, Integer size, Long userId) {
        Page<Favorite> favoritePage = new Page<>(page, size);

        LambdaQueryWrapper<Favorite> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Favorite::getUserId, userId)
                .orderByDesc(Favorite::getCreatedAt);

        favoriteMapper.selectPage(favoritePage, queryWrapper);

        Page<FavoriteVO> voPage = new Page<>(favoritePage.getCurrent(), favoritePage.getSize(), favoritePage.getTotal());
        List<FavoriteVO> voList = new ArrayList<>();

        for (Favorite favorite : favoritePage.getRecords()) {
            Post post = postMapper.selectById(favorite.getPostId());
            if (post == null || !"approved".equals(post.getStatus())) {
                continue;
            }

            FavoriteVO vo = new FavoriteVO();
            vo.setFavoriteId(favorite.getFavoriteId());
            vo.setPostId(post.getPostId());
            vo.setPostTitle(post.getTitle());

            User user = userMapper.selectById(post.getUserId());
            if (user != null) {
                vo.setPostAuthor(user.getUsername());
            }

            List<String> images = getPostImages(post.getPostId());
            if (images != null && !images.isEmpty()) {
                vo.setCoverImage(images.get(0));
            }

            vo.setCreatedAt(favorite.getCreatedAt());
            voList.add(vo);
        }

        voPage.setRecords(voList);
        return voPage;
    }

    /**
     * 处理标签
     * @param tagIds 标签ID列表
     * @param tagNames 标签名称列表
     * @param postId 帖子ID
     */
    private void handleTags(List<Long> tagIds, List<String> tagNames, Long postId) {
        List<Long> tagIdList = new ArrayList<>();

        // 处理已存在的标签ID
        if (!CollectionUtils.isEmpty(tagIds)) {
            tagIdList.addAll(tagIds);
        }

        // 处理新标签名称
        if (!CollectionUtils.isEmpty(tagNames)) {
            for (String tagName : tagNames) {
                // 查询标签是否已存在
                LambdaQueryWrapper<Tag> tagWrapper = new LambdaQueryWrapper<>();
                tagWrapper.eq(Tag::getTagName, tagName);
                Tag existingTag = tagMapper.selectOne(tagWrapper);

                if (existingTag != null) {
                    // 标签已存在，直接使用
                    tagIdList.add(existingTag.getTagId());
                } else {
                    // 标签不存在，创建新标签
                    Tag newTag = new Tag();
                    newTag.setTagName(tagName);
                    newTag.setPostCount(0);
                    newTag.setCreatedAt(LocalDateTime.now());
                    tagMapper.insert(newTag);
                    tagIdList.add(newTag.getTagId());
                }
            }
        }

        // 创建帖子和标签的关联关系
        for (Long tagId : tagIdList) {
            PostTag postTag = new PostTag();
            postTag.setPostId(postId);
            postTag.setTagId(tagId);
            postTagMapper.insert(postTag);
        }
    }

    /**
     * 处理图片
     * @param images 图片URL列表
     * @param postId 帖子ID
     */
    private void handleImages(List<String> images, Long postId) {
        if (!CollectionUtils.isEmpty(images)) {
            for (int i = 0; i < images.size(); i++) {
                PostImage postImage = new PostImage();
                postImage.setPostId(postId);
                postImage.setImageUrl(images.get(i));
                postImage.setSortOrder(i);
                postImage.setCreatedAt(LocalDateTime.now());
                postImageMapper.insert(postImage);
            }
        }
    }
    
    /**
     * 获取帖子标签列表
     * @param postId 帖子ID
     * @return 标签名称列表
     */
    private List<String> getPostTags(Long postId) {
        // 查询帖子关联的标签ID
        LambdaQueryWrapper<PostTag> postTagWrapper = new LambdaQueryWrapper<>();
        postTagWrapper.eq(PostTag::getPostId, postId);
        List<PostTag> postTags = postTagMapper.selectList(postTagWrapper);
        
        if (CollectionUtils.isEmpty(postTags)) {
            return new ArrayList<>();
        }
        
        List<Long> tagIds = postTags.stream().map(PostTag::getTagId).collect(Collectors.toList());
        
        // 查询标签信息
        LambdaQueryWrapper<Tag> tagWrapper = new LambdaQueryWrapper<>();
        tagWrapper.in(Tag::getTagId, tagIds);
        List<Tag> tags = tagMapper.selectList(tagWrapper);
        
        return tags.stream().map(Tag::getTagName).collect(Collectors.toList());
    }
    
    /**
     * 获取帖子图片列表
     * @param postId 帖子ID
     * @return 图片URL列表
     */
    private List<String> getPostImages(Long postId) {
        LambdaQueryWrapper<PostImage> imageWrapper = new LambdaQueryWrapper<>();
        imageWrapper.eq(PostImage::getPostId, postId)
                   .orderByAsc(PostImage::getSortOrder);
        List<PostImage> images = postImageMapper.selectList(imageWrapper);
        
        return images.stream().map(PostImage::getImageUrl).collect(Collectors.toList());
    }
    


    
    @Override
    @Transactional
    public boolean toggleTopPost(Long postId, Integer isTop) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }
        
        // 2. 更新帖子置顶状态
        post.setIsTop(isTop);
        post.setUpdatedAt(LocalDateTime.now());
        return postMapper.updateById(post) > 0;
    }
    
    @Override
    @Transactional
    public boolean toggleFeaturedPost(Long postId, Integer isFeatured) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }
        
        // 2. 更新帖子精华状态
        post.setIsFeatured(isFeatured);
        post.setUpdatedAt(LocalDateTime.now());
        return postMapper.updateById(post) > 0;
    }

    /**
     * ai生成帖子
     * @param prompt
     * @return
     */
    @Override
    public PostGeneratedVO generatePost(String prompt) {
        return aiPostService.generatePost(prompt);
    }

    /**
     * 将Post实体转换为PostVO
     * @param post Post实体
     * @return PostVO对象
     */
    private PostVO convertToPostVO(Post post) {
        PostVO postVO = new PostVO();
        BeanUtils.copyProperties(post, postVO);
        
        // 设置分类信息
        Category category = categoryMapper.selectById(post.getCategoryId());
        if (category != null) {
            CategoryVO categoryVO = new CategoryVO();
            categoryVO.setCategoryId(category.getCategoryId());
            categoryVO.setCategoryName(category.getCategoryName());
            postVO.setCategory(categoryVO);
        }

        // 查询作者信息
        User user = userMapper.selectById(post.getUserId());
        // 设置头像
        postVO.setAvatarUrl(user.getAvatarUrl());
        postVO.setAuthor(user.getUsername());

        // 设置标签信息
        List<String> tags = getPostTags(post.getPostId());
        postVO.setTags(tags);
        
        // 设置图片信息
        List<String> images = getPostImages(post.getPostId());
        postVO.setImages(images);
        
        return postVO;
    }
    


}
