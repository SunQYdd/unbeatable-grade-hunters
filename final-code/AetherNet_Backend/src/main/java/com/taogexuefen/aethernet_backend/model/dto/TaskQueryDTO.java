package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 任务查询参数DTO
 */
@Data
public class TaskQueryDTO {
    private Integer page = 1;

    private Integer size = 10;

    private String status;

    private BigDecimal minReward;

    private BigDecimal maxReward;

    private String keyword;

    private String sortBy = "created_at";

    private String order = "desc";

    private String type;

    private Long categoryId;

    private Long publisherId;

    private Long accepterId;

    private Boolean unassignedOnly;
}
