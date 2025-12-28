package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 用户登录请求DTO
 */
@Data
public class UserLoginRequest {
    /**
     * 学号
     */
    private String studentId;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 用户角色，student表示学生，admin表示管理员
     */
    private String role;
}