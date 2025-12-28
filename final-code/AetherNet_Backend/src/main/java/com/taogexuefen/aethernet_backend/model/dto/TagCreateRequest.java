package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 标签创建请求DTO
 */
@Data
public class TagCreateRequest {
    /**
     * 标签名称
     */
    private String tagName;
}