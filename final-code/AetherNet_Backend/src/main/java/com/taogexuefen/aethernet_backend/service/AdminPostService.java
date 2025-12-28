package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.PostModerateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostFeaturedRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostTopRequest;
import com.taogexuefen.aethernet_backend.model.entity.Post;
import com.taogexuefen.aethernet_backend.model.vo.ModerationLogVO;
import com.taogexuefen.aethernet_backend.model.vo.PostVO;

public interface AdminPostService {
    /**
     * 获取待审核帖子列表
     * @param page 页码
     * @param size 每页条数
     * @return 帖子分页列表
     */
    Page<PostVO> getPendingPosts(Integer page, Integer size);

    /**
     * 审核帖子
     * @param postId 帖子ID
     * @param request 审核请求
     * @param adminId 管理员ID
     * @return 是否审核成功
     */
    boolean moderatePost(Long postId, PostModerateRequest request, Long adminId);

    /**
     * 置顶/取消置顶帖子
     * @param postId 帖子ID
     * @param request 置顶请求
     * @return 是否操作成功
     */
    boolean topPost(Long postId, PostTopRequest request);

    /**
     * 设置/取消精华帖
     * @param postId 帖子ID
     * @param request 精华帖请求
     * @return 是否操作成功
     */
    boolean featurePost(Long postId, PostFeaturedRequest request);

    /**
     * 获取审核日志
     * @param page 页码
     * @param size 每页条数
     * @param moderatorId 审核员ID（可选）
     * @param startDate 开始日期（可选）
     * @param endDate 结束日期（可选）
     * @return 审核日志分页列表
     */
    Page<ModerationLogVO> getModerationLogs(Integer page, Integer size, Long moderatorId, String startDate, String endDate);
}