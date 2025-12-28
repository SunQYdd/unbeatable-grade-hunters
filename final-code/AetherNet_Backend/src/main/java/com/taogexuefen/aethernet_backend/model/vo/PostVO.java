package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 帖子VO（用于列表展示）
 */
@Data
public class PostVO {
    /**
     * 帖子唯一标识符
     */
    private Long postId;
    
    /**
     * 帖子标题
     */
    private String title;
    
    /**
     * 帖子内容摘要
     */
    private String content;
    
    /**
     * 帖子分类信息
     */
    private CategoryVO category;
    
    /**
     * 作者名称
     */
    private String author;
    
    /**
     * 浏览次数
     */
    private Integer viewCount;
    
    /**
     * 点赞数
     */
    private Integer likeCount;
    
    /**
     * 评论数
     */
    private Integer commentCount;
    
    /**
     * 是否置顶，0表示否，1表示是
     */
    private Integer isTop;
    
    /**
     * 是否精华帖，0表示否，1表示是
     */
    private Integer isFeatured;
    
    /**
     * 标签列表
     */
    private List<String> tags;
    
    /**
     * 图片链接列表
     */
    private List<String> images;
    
    /**
     * 地理位置信息
     */
    private String location;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 状态
     */
    private String status;

    /**
     * 当前用户是否已点赞
     */
    private Boolean isLiked;
}
