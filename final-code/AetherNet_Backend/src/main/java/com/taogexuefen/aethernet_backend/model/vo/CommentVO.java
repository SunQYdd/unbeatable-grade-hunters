package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 评论VO
 */
@Data
public class CommentVO {
    /**
     * 评论唯一标识符
     */
    private Long commentId;
    
    /**
     * 所属帖子ID
     */
    private Long postId;
    
    /**
     * 父级评论ID
     */
    private Long parentId;
    
    /**
     * 评论内容
     */
    private String content;
    
    /**
     * 评论用户信息
     */
    private UserVO user;
    
    /**
     * 点赞数
     */
    private Integer likeCount;
    
    /**
     * 当前用户是否已点赞
     */
    private Boolean isLiked;
    
    /**
     * 直接回复该评论的数量
     */
    private Integer replyCount;
    
    /**
     * 评论创建时间
     */
    private String createdAt;
}