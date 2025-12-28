package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 分类更新请求DTO
 */
@Data
public class CategoryUpdateRequest {
    /**
     * 分类名称
     */
    private String categoryName;
    
    /**
     * 分类代码
     */
    private String categoryCode;
    
    /**
     * 排序序号
     */
    private Integer sortOrder;
}