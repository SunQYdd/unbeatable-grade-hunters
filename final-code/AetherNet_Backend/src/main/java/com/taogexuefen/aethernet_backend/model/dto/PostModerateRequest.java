package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 帖子审核请求DTO
 */
@Data
public class PostModerateRequest {
    /**
     * 审核决定：approved(通过) 或 rejected(拒绝)
     */
    private String decision;

    /**
     * 风险等级：low(低风险)、medium(中风险)、high(高风险)
     */
    private String riskLevel;

    /**
     * 审核备注/理由
     */
    private String reason;
}