package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;
import java.util.List;

@Data
public class PostGeneratedVO {
    private String title;
    private String content;
    private Long categoryId;      // 可选：AI 推荐的分类 ID
    private List<String> tagNames; // 可选：AI 推荐的标签列表
}