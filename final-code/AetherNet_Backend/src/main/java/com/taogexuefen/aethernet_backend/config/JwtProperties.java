package com.taogexuefen.aethernet_backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    /**
     * 密钥
     */
    private String secret;

    /**
     * 过期时间
     */
    private Long ttl;

    /**
     * 请求头名
     */
    private String tokenName;
}
