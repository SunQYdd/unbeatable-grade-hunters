package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 评论创建请求DTO
 */
@Data
public class CommentCreateRequest {
    /**
     * 所属帖子ID
     */
    private Long postId;
    
    /**
     * 评论内容
     */
    private String content;
    
    /**
     * 父级评论ID，用于构建评论回复树结构
     * 回复评论时指定被回复的评论ID，直接评论帖子时传0或不传
     */

    private Long parentId = null;
}