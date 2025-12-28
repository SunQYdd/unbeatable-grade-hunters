package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 任务创建请求DTO
 */
@Data
public class TaskCreateRequest {
    /**
     * 任务标题，简要说明任务内容
     */
    private String title;

    /**
     * 任务详细描述
     */
    private String description;

    /**
     * 任务酬劳金额，单位为元
     */
    private BigDecimal reward;

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

    /**
     * 联系方式
     */
    private String contactInfo;

    private Long categoryId;

    private String type;
}
