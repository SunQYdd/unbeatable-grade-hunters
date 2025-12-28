package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 管理员创建请求DTO
 */
@Data
public class AdminCreateRequest {
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 手机号
     */
    private String phone;
}