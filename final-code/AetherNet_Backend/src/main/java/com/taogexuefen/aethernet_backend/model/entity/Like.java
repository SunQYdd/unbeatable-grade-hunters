package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 点赞实体类
 * 对应数据库表: tb_likes
 */
@Data
@TableName("tb_likes")
public class Like {
    /**
     * 点赞记录唯一标识符
     */
    @TableId(value = "like_id", type = IdType.AUTO)
    private Long likeId;

    /**
     * 点赞用户ID，关联用户表
     */
    private Long userId;

    /**
     * 被点赞帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 被点赞评论ID，关联评论表
     */
    private Long commentId;

    /**
     * 点赞时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}