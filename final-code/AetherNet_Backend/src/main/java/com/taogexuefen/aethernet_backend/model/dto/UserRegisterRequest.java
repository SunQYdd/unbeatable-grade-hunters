package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 用户注册请求DTO
 */
@Data
public class UserRegisterRequest {
    /**
     * 学号
     */
    private String studentId;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 用户角色，student表示学生，admin表示管理员
     */
    private String role;
}