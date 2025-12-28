package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 帖子实体类
 * 对应数据库表: tb_posts
 */
@Data
@TableName("tb_posts")
public class Post {
    /**
     * 帖子唯一标识符
     */
    @TableId(value = "post_id", type = IdType.AUTO)
    private Long postId;

    /**
     * 帖子标题，简要概括内容
     */
    private String title;

    /**
     * 帖子正文内容
     */
    private String content;

    /**
     * 发布者用户ID，关联用户表
     */
    private Long userId;

    /**
     * 帖子分类ID，关联分类表
     */
    private Long categoryId;

    /**
     * 帖子状态：'pending'(待审核)、'approved'(已通过)、'rejected'(已拒绝)、'deleted'(已删除)
     */
    private String status;

    /**
     * 帖子浏览次数统计
     */
    private Integer viewCount;

    /**
     * 帖子点赞数统计
     */
    private Integer likeCount;

    /**
     * 帖子评论数统计
     */
    private Integer commentCount;

    /**
     * 是否匿名发布，0表示否，1表示是
     */
    private Integer isAnonymous;

    /**
     * 是否置顶，0表示否，1表示是
     */
    private Integer isTop;

    /**
     * 是否精华帖，0表示否，1表示是
     */
    private Integer isFeatured;

    /**
     * 地理位置信息
     */
    private String location;

    /**
     * 联系方式
     */
    private String contactInfo;

    /**
     * 发布者IP地址
     */
    private String ipAddress;

    /**
     * 帖子发布时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 帖子最后更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 最后更新者ID，关联用户表
     */
    private Long updatedBy;
}