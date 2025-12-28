package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 收藏实体类
 * 对应数据库表: tb_favorites
 */
@Data
@TableName("tb_favorites")
public class Favorite {
    /**
     * 收藏记录唯一标识符
     */
    @TableId(value = "favorite_id", type = IdType.AUTO)
    private Long favoriteId;

    /**
     * 收藏用户ID，关联用户表
     */
    private Long userId;

    /**
     * 被收藏帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 收藏时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}