package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.CommentMapper;
import com.taogexuefen.aethernet_backend.mapper.LikeMapper;
import com.taogexuefen.aethernet_backend.mapper.PostMapper;
import com.taogexuefen.aethernet_backend.model.dto.CommentCreateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Comment;
import com.taogexuefen.aethernet_backend.model.entity.Like;
import com.taogexuefen.aethernet_backend.model.entity.Post;
import com.taogexuefen.aethernet_backend.model.vo.CommentVO;
import com.taogexuefen.aethernet_backend.model.vo.UserVO;
import com.taogexuefen.aethernet_backend.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private LikeMapper likeMapper;

    @Override
    @Transactional
    public Long createComment(CommentCreateRequest commentCreateRequest, Long userId) {
        // 1. 校验帖子是否存在
        Post post = postMapper.selectById(commentCreateRequest.getPostId());
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        // 2. 创建评论
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentCreateRequest, comment);
        comment.setUserId(userId);
        comment.setStatus(1); // 默认正常状态
        comment.setLikeCount(0);
        comment.setReplyCount(0);
        comment.setCreatedAt(LocalDateTime.now());
        commentMapper.insert(comment);

        Long commentId = comment.getCommentId();

        // 3. 更新帖子的评论数
        post.setCommentCount(post.getCommentCount() + 1);
        postMapper.updateById(post);

        // 4. 如果是回复评论，更新父评论的回复数
        if (comment.getParentId() != null && comment.getParentId() > 0) {
            Comment parentComment = commentMapper.selectById(comment.getParentId());
            if (parentComment != null) {
                parentComment.setReplyCount(parentComment.getReplyCount() + 1);
                commentMapper.updateById(parentComment);
            }
        }

        return commentId;
    }

    @Override
    @Transactional
    public boolean deleteComment(Long commentId, Long userId) {
        // 1. 校验评论是否存在且属于当前用户
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除该评论");
        }

        // 2. 删除评论（逻辑删除，修改状态为已删除）
        comment.setStatus(0);
        boolean success = commentMapper.updateById(comment) > 0;

        if (success) {
            // 3. 更新帖子的评论数
            Post post = postMapper.selectById(comment.getPostId());
            if (post != null) {
                post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
                postMapper.updateById(post);
            }

            // 4. 如果是回复评论，更新父评论的回复数
            if (comment.getParentId() != null && comment.getParentId() > 0) {
                Comment parentComment = commentMapper.selectById(comment.getParentId());
                if (parentComment != null) {
                    parentComment.setReplyCount(Math.max(0, parentComment.getReplyCount() - 1));
                    commentMapper.updateById(parentComment);
                }
            }
        }

        return success;
    }

    @Override
    public Page<CommentVO> getPostComments(Long postId, Integer page, Integer size, String sortBy, String order, Long userId) {
        // 1. 校验帖子是否存在
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        // 2. 构建分页对象
        Page<Comment> commentPage = new Page<>(page, size);

        // 3. 构建查询条件
        LambdaQueryWrapper<Comment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Comment::getPostId, postId)
                .eq(Comment::getStatus, 1) // 只查询正常状态的评论
                .isNull(Comment::getParentId); // 只查询直接评论帖子的评论，不包括回复

        // 4. 排序
        if ("likeCount".equals(sortBy)) {
            queryWrapper.orderBy(true, "desc".equals(order), Comment::getLikeCount);
        } else {
            queryWrapper.orderBy(true, "desc".equals(order), Comment::getCreatedAt);
        }

        // 5. 执行分页查询
        commentMapper.selectPage(commentPage, queryWrapper);

        // 6. 转换为VO对象
        Page<CommentVO> voPage = new Page<>(commentPage.getCurrent(), commentPage.getSize(), commentPage.getTotal());
        
        // 7. 转换Comment为CommentVO，并设置是否点赞状态
        List<CommentVO> commentVOList = commentPage.getRecords().stream().map(comment -> {
            CommentVO commentVO = convertToCommentVO(comment);
            
            // 查询当前用户是否点赞了该评论
            if (userId != null) {
                LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
                likeWrapper.eq(Like::getUserId, userId)
                        .eq(Like::getCommentId, comment.getCommentId())
                        .isNull(Like::getPostId); // 只查询评论的点赞，不包括帖子的点赞
                commentVO.setIsLiked(likeMapper.selectCount(likeWrapper) > 0);
            } else {
                commentVO.setIsLiked(false);
            }
            
            return commentVO;
        }).collect(Collectors.toList());
        
        voPage.setRecords(commentVOList);

        return voPage;
    }

    @Override
    public Page<CommentVO> getCommentReplies(Long commentId, Integer page, Integer size, String sortBy, String order, Long userId) {
        // 1. 校验评论是否存在
        Comment parentComment = commentMapper.selectById(commentId);
        if (parentComment == null) {
            throw new RuntimeException("评论不存在");
        }

        // 2. 构建分页对象
        Page<Comment> commentPage = new Page<>(page, size);

        // 3. 构建查询条件
        LambdaQueryWrapper<Comment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Comment::getParentId, commentId)
                .eq(Comment::getStatus, 1); // 只查询正常状态的回复

        // 4. 排序（回复默认按时间正序排列）
        if ("likeCount".equals(sortBy)) {
            queryWrapper.orderBy(true, "desc".equals(order), Comment::getLikeCount);
        } else {
            queryWrapper.orderBy(true, "asc".equals(order), Comment::getCreatedAt);
        }

        // 5. 执行分页查询
        commentMapper.selectPage(commentPage, queryWrapper);

        // 6. 转换为VO对象
        Page<CommentVO> voPage = new Page<>(commentPage.getCurrent(), commentPage.getSize(), commentPage.getTotal());
        
        // 7. 转换Comment为CommentVO，并设置是否点赞状态
        List<CommentVO> commentVOList = commentPage.getRecords().stream().map(comment -> {
            CommentVO commentVO = convertToCommentVO(comment);
            
            // 查询当前用户是否点赞了该评论
            if (userId != null) {
                LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
                likeWrapper.eq(Like::getUserId, userId)
                        .eq(Like::getCommentId, comment.getCommentId())
                        .isNull(Like::getPostId); // 只查询评论的点赞，不包括帖子的点赞
                commentVO.setIsLiked(likeMapper.selectCount(likeWrapper) > 0);
            } else {
                commentVO.setIsLiked(false);
            }
            
            return commentVO;
        }).collect(Collectors.toList());
        
        voPage.setRecords(commentVOList);

        return voPage;
    }

    @Override
    @Transactional
    public LikeResult likeComment(Long commentId, Long userId) {
        // 1. 校验评论是否存在
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }

        // 2. 查询是否已点赞
        LambdaQueryWrapper<Like> likeWrapper = new LambdaQueryWrapper<>();
        likeWrapper.eq(Like::getUserId, userId)
                .eq(Like::getCommentId, commentId)
                .isNull(Like::getPostId); // 只查询评论的点赞，不包括帖子的点赞

        Like like = likeMapper.selectOne(likeWrapper);

        if (like != null) {
            // 已点赞，取消点赞
            likeMapper.delete(likeWrapper);
            comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
            commentMapper.updateById(comment);

            return new LikeResult(false, comment.getLikeCount());
        } else {
            // 未点赞，添加点赞
            Like newLike = new Like();
            newLike.setUserId(userId);
            newLike.setCommentId(commentId);
            newLike.setCreatedAt(LocalDateTime.now());
            likeMapper.insert(newLike);

            comment.setLikeCount(comment.getLikeCount() + 1);
            commentMapper.updateById(comment);

            return new LikeResult(true, comment.getLikeCount());
        }
    }

    /**
     * 将Comment实体转换为CommentVO
     * @param comment Comment实体
     * @return CommentVO对象
     */
    private CommentVO convertToCommentVO(Comment comment) {
        CommentVO commentVO = new CommentVO();
        BeanUtils.copyProperties(comment, commentVO);

        // 简化处理用户信息，实际项目中需要从用户服务获取
        UserVO userVO = new UserVO();
        userVO.setUserId(comment.getUserId());
        userVO.setUsername("用户名"); // 需要从用户服务获取
        userVO.setAvatarUrl("头像链接"); // 需要从用户服务获取
        commentVO.setUser(userVO);

        return commentVO;
    }

    // 兼容旧方法签名
    @Override
    public Page<CommentVO> getPostComments(Long postId, Integer page, Integer size, String sortBy, String order) {
        return getPostComments(postId, page, size, sortBy, order, null);
    }

    // 兼容旧方法签名
    @Override
    public Page<CommentVO> getCommentReplies(Long commentId, Integer page, Integer size, String sortBy, String order) {
        return getCommentReplies(commentId, page, size, sortBy, order, null);
    }
}