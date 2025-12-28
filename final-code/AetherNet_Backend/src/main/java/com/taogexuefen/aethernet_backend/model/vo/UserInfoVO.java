package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 用户信息VO
 */
@Data
public class UserInfoVO {
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 学号
     */
    private String studentId;
    
    /**
     * 用户角色
     */
    private String role;
}