package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 审核日志VO
 */
@Data
public class ModerationLogVO {
    /**
     * 日志ID
     */
    private Long logId;

    /**
     * 帖子标题
     */
    private String postTitle;

    /**
     * 审核员名称
     */
    private String moderator;

    /**
     * 审核决定：approved(通过) 或 rejected(拒绝)
     */
    private String decision;

    /**
     * 风险等级：low(低风险)、medium(中风险)、high(高风险)
     */
    private String riskLevel;

    /**
     * 审核理由或备注信息
     */
    private String reason;

    /**
     * 审核执行时间
     */
    private LocalDateTime createdAt;
}