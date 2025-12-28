package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 用户VO
 */
@Data
public class UserVO {
    /**
     * 用户唯一标识符
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 用户头像链接
     */
    private String avatarUrl;

    /**
     * 学号
     */
    private String studentId;

    /**
     * 用户类别：student学生，admin管理员
     */
    private String role;

    /**
     * 用户状态： 1启用，0禁用
     */
    private Integer status;
}