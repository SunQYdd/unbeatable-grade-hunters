package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;
import java.util.List;

/**
 * 帖子详情VO（用于详情页展示）
 */
@Data
public class PostDetailVO {
    /**
     * 帖子唯一标识符
     */
    private Long postId;
    
    /**
     * 帖子标题
     */
    private String title;
    
    /**
     * 帖子正文内容
     */
    private String content;
    
    /**
     * 帖子分类信息
     */
    private CategoryVO category;
    
    /**
     * 作者信息
     */
    private AuthorVO author;
    
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
     * 当前用户是否已点赞
     */
    private Boolean isLiked;
    
    /**
     * 当前用户是否已收藏
     */
    private Boolean isFavorited;
    
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
     * 联系方式
     */
    private String contactInfo;
    
    /**
     * 创建时间
     */
    private String createdAt;
    
    /**
     * 更新时间
     */
    private String updatedAt;
}