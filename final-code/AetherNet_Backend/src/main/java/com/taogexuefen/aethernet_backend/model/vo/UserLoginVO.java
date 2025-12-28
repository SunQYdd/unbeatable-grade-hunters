package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 用户登录响应VO
 */
@Data
public class UserLoginVO {
    /**
     * 访问令牌
     */
    private String accessToken;
    
    /**
     * 用户信息
     */
    private UserInfoVO user;
}