package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.CommentCreateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Comment;
import com.taogexuefen.aethernet_backend.model.vo.CommentVO;

public interface CommentService {
    /**
     * 发布评论
     * @param commentCreateRequest 评论创建请求
     * @param userId 用户ID
     * @return 评论ID
     */
    Long createComment(CommentCreateRequest commentCreateRequest, Long userId);

    /**
     * 删除评论
     * @param commentId 评论ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteComment(Long commentId, Long userId);

    /**
     * 获取帖子评论列表
     * @param postId 帖子ID
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序字段
     * @param order 排序方式
     * @return 评论分页列表
     */
    Page<CommentVO> getPostComments(Long postId, Integer page, Integer size, String sortBy, String order);

    /**
     * 获取帖子评论列表
     * @param postId 帖子ID
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序字段
     * @param order 排序方式
     * @param userId 用户ID
     * @return 评论分页列表
     */
    Page<CommentVO> getPostComments(Long postId, Integer page, Integer size, String sortBy, String order, Long userId);

    /**
     * 获取评论的直接回复列表
     * @param commentId 评论ID
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序字段
     * @param order 排序方式
     * @return 回复分页列表
     */
    Page<CommentVO> getCommentReplies(Long commentId, Integer page, Integer size, String sortBy, String order);

    /**
     * 获取评论的直接回复列表
     * @param commentId 评论ID
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序字段
     * @param order 排序方式
     * @param userId 用户ID
     * @return 回复分页列表
     */
    Page<CommentVO> getCommentReplies(Long commentId, Integer page, Integer size, String sortBy, String order, Long userId);

    /**
     * 点赞/取消点赞评论
     * @param commentId 评论ID
     * @param userId 用户ID
     * @return 点赞结果
     */
    LikeResult likeComment(Long commentId, Long userId);

    /**
     * 点赞结果类
     */
    class LikeResult {
        private Boolean isLiked;
        private Integer likeCount;

        public LikeResult(Boolean isLiked, Integer likeCount) {
            this.isLiked = isLiked;
            this.likeCount = likeCount;
        }

        public Boolean getIsLiked() {
            return isLiked;
        }

        public void setIsLiked(Boolean isLiked) {
            this.isLiked = isLiked;
        }

        public Integer getLikeCount() {
            return likeCount;
        }

        public void setLikeCount(Integer likeCount) {
            this.likeCount = likeCount;
        }
    }
}