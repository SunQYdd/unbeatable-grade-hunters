package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

/**
 * 分类VO
 */
@Data
public class CategoryVO {
    /**
     * 分类唯一标识符
     */
    private Long categoryId;
    
    /**
     * 分类名称
     */
    private String categoryName;
    
    /**
     * 分类代码
     */
    private String categoryCode;
}