package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 帖子查询参数DTO
 */
@Data
public class PostQueryDTO {
    /**
     * 页码，默认为1
     */
    private Integer page = 1;
    
    /**
     * 每页条数，默认为10
     */
    private Integer size = 10;
    
    /**
     * 分类ID，用于筛选指定分类的帖子
     */
    private Long categoryId;
    
    /**
     * 标签ID，用于筛选包含指定标签的帖子
     */
    private Long tagId;
    
    /**
     * 关键词，用于搜索帖子标题或内容
     */
    private String keyword;
    
    /**
     * 排序字段，可选值：created_at, view_count, like_count
     */
    private String sortBy = "created_at";
    
    /**
     * 排序方式，可选值：asc, desc
     */
    private String order = "desc";

    private Boolean onlyMine;
}
