package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 评论实体类
 * 对应数据库表: tb_comments
 */
@Data
@TableName("tb_comments")
public class Comment {
    /**
     * 评论唯一标识符
     */
    @TableId(value = "comment_id", type = IdType.AUTO)
    private Long commentId;

    /**
     * 所属帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 评论者用户ID，关联用户表
     */
    private Long userId;

    /**
     * 父级评论ID，用于构建评论回复树结构
     */
    private Long parentId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 评论状态，1表示正常，0表示已删除
     */
    private Integer status;

    /**
     * 评论点赞数统计
     */
    private Integer likeCount;

    /**
     * 直接回复该评论的数量统计
     */
    private Integer replyCount;

    /**
     * 评论者IP地址
     */
    private String ipAddress;

    /**
     * 评论发布时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}