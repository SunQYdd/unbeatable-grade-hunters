package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.CategoryMapper;
import com.taogexuefen.aethernet_backend.mapper.ModerationLogMapper;
import com.taogexuefen.aethernet_backend.mapper.PostMapper;
import com.taogexuefen.aethernet_backend.mapper.UserMapper;
import com.taogexuefen.aethernet_backend.model.dto.PostModerateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostFeaturedRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostTopRequest;
import com.taogexuefen.aethernet_backend.model.entity.Category;
import com.taogexuefen.aethernet_backend.model.entity.ModerationLog;
import com.taogexuefen.aethernet_backend.model.entity.Post;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.vo.CategoryVO;
import com.taogexuefen.aethernet_backend.model.vo.ModerationLogVO;
import com.taogexuefen.aethernet_backend.model.vo.PostVO;
import com.taogexuefen.aethernet_backend.service.AdminPostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AdminPostServiceImpl extends ServiceImpl<PostMapper, Post> implements AdminPostService {

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ModerationLogMapper moderationLogMapper;

    /**
     * 获取待审核列表
     * @param page 页码
     * @param size 每页条数
     * @return
     */
    @Override
    public Page<PostVO> getPendingPosts(Integer page, Integer size) {
        // 1. 构建分页对象
        Page<Post> postPage = new Page<>(page, size);

        // 2. 构建查询条件：只查询待审核的帖子
        LambdaQueryWrapper<Post> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Post::getStatus, "pending");
        queryWrapper.orderByDesc(Post::getCreatedAt);

        // 3. 执行分页查询
        postPage = postMapper.selectPage(postPage, queryWrapper);

        // 4. 转换为VO对象
        Page<PostVO> voPage = new Page<>(postPage.getCurrent(), postPage.getSize(), postPage.getTotal());
        List<PostVO> voList = new ArrayList<>();
        for (Post post : postPage.getRecords()) {
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

            Long userId = post.getUserId();
            User user = userMapper.selectById(userId);
            postVO.setAuthor(user.getUsername());

            voList.add(postVO);
        }
        voPage.setRecords(voList);

        return voPage;
    }

    @Override
    @Transactional
    public boolean moderatePost(Long postId, PostModerateRequest request, Long adminId) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        // 2. 校验帖子状态
        if (!"pending".equals(post.getStatus())) {
            throw new RuntimeException("帖子状态不正确，无法审核");
        }

        // 3. 更新帖子状态
        post.setStatus(request.getDecision());
        post.setUpdatedAt(LocalDateTime.now());
        post.setUpdatedBy(adminId);
        boolean success = postMapper.updateById(post) > 0;

        if (success) {
            // 4. 记录审核日志
            ModerationLog log = new ModerationLog();
            log.setPostId(postId);
            log.setModeratorId(adminId);
            log.setDecision(request.getDecision());
            log.setRiskLevel(request.getRiskLevel());
            log.setReason(request.getReason());
            log.setCreatedAt(LocalDateTime.now());
            moderationLogMapper.insert(log);
        }

        return success;
    }

    @Override
    public boolean topPost(Long postId, PostTopRequest request) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        // 2. 更新帖子置顶状态
        post.setIsTop(request.getIsTop());
        post.setUpdatedAt(LocalDateTime.now());
        return postMapper.updateById(post) > 0;
    }

    @Override
    public boolean featurePost(Long postId, PostFeaturedRequest request) {
        // 1. 查询帖子信息
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new RuntimeException("帖子不存在");
        }

        // 2. 更新帖子精华状态
        post.setIsFeatured(request.getIsFeatured());
        post.setUpdatedAt(LocalDateTime.now());
        return postMapper.updateById(post) > 0;
    }

    @Override
    public Page<ModerationLogVO> getModerationLogs(Integer page, Integer size, Long moderatorId, String startDate, String endDate) {
        // 1. 构建分页对象
        Page<ModerationLog> logPage = new Page<>(page, size);

        // 2. 构建查询条件
        LambdaQueryWrapper<ModerationLog> queryWrapper = new LambdaQueryWrapper<>();
        
        // 审核员筛选
        if (moderatorId != null) {
            queryWrapper.eq(ModerationLog::getModeratorId, moderatorId);
        }
        
        // 日期范围筛选
        if (StringUtils.hasText(startDate)) {
            queryWrapper.ge(ModerationLog::getCreatedAt, startDate);
        }
        if (StringUtils.hasText(endDate)) {
            queryWrapper.le(ModerationLog::getCreatedAt, endDate);
        }

        // 按创建时间倒序排列
        queryWrapper.orderByDesc(ModerationLog::getCreatedAt);

        // 3. 执行分页查询
        moderationLogMapper.selectPage(logPage, queryWrapper);

        // 4. 转换为VO对象
        Page<ModerationLogVO> voPage = new Page<>(logPage.getCurrent(), logPage.getSize(), logPage.getTotal());
        List<ModerationLogVO> voList = new ArrayList<>();
        for (ModerationLog log : logPage.getRecords()) {
            ModerationLogVO logVO = new ModerationLogVO();
            BeanUtils.copyProperties(log, logVO);

            // 设置帖子标题
            Post post = postMapper.selectById(log.getPostId());
            if (post != null) {
                logVO.setPostTitle(post.getTitle());
            }

            // 设置审核员名称
            if (log.getModeratorId() != null) {
                User moderator = userMapper.selectById(log.getModeratorId());
                if (moderator != null) {
                    logVO.setModerator(moderator.getUsername());
                }
            }

            voList.add(logVO);
        }
        voPage.setRecords(voList);

        return voPage;
    }
}