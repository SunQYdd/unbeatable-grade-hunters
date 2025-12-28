package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

/**
 * 帖子标签关联实体类
 * 对应数据库表: tb_post_tags
 */
@Data
@TableName("tb_post_tags")
public class PostTag {
    /**
     * 帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 标签ID，关联标签表
     */
    private Long tagId;
}