package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 帖子精华请求DTO
 */
@Data
public class PostFeaturedRequest {
    /**
     * 是否精华帖：1表示设为精华帖，0表示取消精华帖
     */
    private Integer isFeatured;
}