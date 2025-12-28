package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 点赞响应VO
 */
@Data
public class LikeResponse {
    /**
     * 当前是否已点赞
     */
    private Boolean isLiked;
    
    /**
     * 点赞总数
     */
    private Integer likeCount;
}