package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 分类查询参数DTO
 */
@Data
public class CategoryQueryDTO {
    /**
     * 页码，默认为1
     */
    private Integer page = 1;

    /**
     * 每页条数，默认为10
     */
    private Integer size = 10;

    /**
     * 关键词搜索
     */
    private String keyword;
}