package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 作者VO
 */
@Data
public class AuthorVO {
    /**
     * 用户唯一标识符
     */
    private Long userId;
    
    /**
     * 学号
     */
    private String studentId;
    
    /**
     * 用户头像链接
     */
    private String avatarUrl;

    /**
     * 用户名
     */
    private String username;

}