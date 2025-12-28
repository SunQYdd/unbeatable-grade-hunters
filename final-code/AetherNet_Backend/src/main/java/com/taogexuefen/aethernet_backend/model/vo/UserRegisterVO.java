package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 用户注册响应VO
 */
@Data
public class UserRegisterVO {
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 学号
     */
    private String studentId;
    
    /**
     * 手机号
     */
    private String phone;
}