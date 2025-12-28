package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 帖子置顶请求DTO
 */
@Data
public class PostTopRequest {
    /**
     * 是否置顶：1表示置顶，0表示取消置顶
     */
    private Integer isTop;
}