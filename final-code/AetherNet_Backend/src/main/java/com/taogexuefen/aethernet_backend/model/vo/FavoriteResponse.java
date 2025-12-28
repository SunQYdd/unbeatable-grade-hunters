package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 收藏响应VO
 */
@Data
public class FavoriteResponse {
    /**
     * 当前是否已收藏
     */
    private Boolean isFavorited;
}