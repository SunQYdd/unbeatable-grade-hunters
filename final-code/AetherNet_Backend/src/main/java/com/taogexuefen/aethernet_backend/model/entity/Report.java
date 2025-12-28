package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 举报实体类
 * 对应数据库表: tb_reports
 */
@Data
@TableName("tb_reports")
public class Report {
    /**
     * 举报记录唯一标识符
     */
    @TableId(value = "report_id", type = IdType.AUTO)
    private Long reportId;

    /**
     * 举报用户ID，关联用户表
     */
    private Long reporterId;

    /**
     * 被举报帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 被举报评论ID，关联评论表
     */
    private Long commentId;

    /**
     * 举报原因
     */
    private String reason;

    /**
     * 举报状态：'pending'(待处理)、'processed'(已处理)、'dismissed'(已驳回)
     */
    private String status;

    /**
     * 处理人ID，关联用户表（管理员）
     */
    private Long handledBy;

    /**
     * 处理时间
     */
    private LocalDateTime handledAt;

    /**
     * 举报时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}