package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 审核日志实体类
 * 对应数据库表: tb_moderation_logs
 */
@Data
@TableName("tb_moderation_logs")
public class ModerationLog {
    /**
     * 审核日志唯一标识符
     */
    @TableId(value = "log_id", type = IdType.AUTO)
    private Long logId;

    /**
     * 被审核的帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 审核员ID，关联用户表（若为系统自动审核则为空）
     */
    private Long moderatorId;

    /**
     * 审核决定：'approved'(通过) 或 'rejected'(拒绝)
     */
    private String decision;

    /**
     * 风险等级评估：'low'(低风险)、'medium'(中风险)、'high'(高风险)
     */
    private String riskLevel;

    /**
     * 审核理由或备注信息
     */
    private String reason;

    /**
     * 审核执行时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}