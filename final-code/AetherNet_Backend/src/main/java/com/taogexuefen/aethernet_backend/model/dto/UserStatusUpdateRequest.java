package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 用户状态更新请求DTO
 */
@Data
public class UserStatusUpdateRequest {
    /**
     * 用户状态，0表示禁用，1表示启用
     */
    private Integer status;
}