package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 任务实体类
 * 对应数据库表: tb_tasks
 */
@Data
@TableName("tb_tasks")
public class Task {
    /**
     * 任务唯一标识符
     */
    @TableId(value = "task_id", type = IdType.AUTO)
    private Long taskId;

    /**
     * 任务标题，简要说明任务内容
     */
    private String title;

    /**
     * 任务详细描述
     */
    private String description;

    /**
     * 任务发布者ID，关联用户表
     */
    private Long publisherId;

    /**
     * 任务接单者ID，关联用户表
     */
    private Long assigneeId;

    /**
     * 任务酬劳金额，单位为元
     */
    private BigDecimal reward;

    /**
     * 任务状态：'open'(开放中)、'in_progress'(进行中)、'completed'(已完成)、'cancelled'(已取消)
     */
    private String status;

    /**
     * 任务截止时间
     */
    private LocalDateTime deadline;

    /**
     * 任务地点
     */
    private String location;

    private Double latitude;

    private Double longitude;

    private String contactInfo;

    private Long categoryId;

    private String type;

    /**
     * 任务实际完成时间
     */
    private LocalDateTime completedAt;

    /**
     * 任务创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 任务最后更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
