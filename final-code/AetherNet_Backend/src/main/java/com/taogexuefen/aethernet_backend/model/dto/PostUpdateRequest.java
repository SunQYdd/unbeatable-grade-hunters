package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;
import java.util.List;

/**
 * 帖子更新请求DTO
 */
@Data
public class PostUpdateRequest {
    /**
     * 帖子标题
     */
    private String title;
    
    /**
     * 帖子内容
     */
    private String content;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 标签ID数组（推荐）
     */
    private List<Long> tagIds;
    
    /**
     * 新标签名称数组（可选，用于创建新标签）
     */
    private List<String> tagNames;
    
    /**
     * 图片链接数组
     */
    private List<String> images;
    
    /**
     * 地点信息
     */
    private String location;
    
    /**
     * 联系方式
     */
    private String contactInfo;
}