package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 任务VO
 */
@Data
public class TaskVO {
    /**
     * 任务唯一标识符
     */
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
     * 发布者信息
     */
    private UserVO publisher;

    /**
     * 接单者信息
     */
    private UserVO assignee;

    /**
     * 任务酬劳金额，单位为元
     */
    private BigDecimal reward;

    /**
     * 任务状态：'open'(开放中)、'in_progress'(进行中)、'completed'(已完成)、'cancelled'(已取消)
     */
    private String status;

    /**
     * 任务地点
     */
    private String location;

    private Double latitude;

    private Double longitude;

    /**
     * 任务截止时间
     */
    private LocalDateTime deadline;

    /**
     * 任务创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 任务最后更新时间
     */
    private LocalDateTime updatedAt;

    private Long categoryId;

    private String type;
}
