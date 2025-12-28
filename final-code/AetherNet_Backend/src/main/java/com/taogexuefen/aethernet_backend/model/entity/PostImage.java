package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 帖子图片实体类
 * 对应数据库表: tb_post_images
 */
@Data
@TableName("tb_post_images")
public class PostImage {
    /**
     * 图片唯一标识符
     */
    @TableId(value = "image_id", type = IdType.AUTO)
    private Long imageId;

    /**
     * 所属帖子ID，关联帖子表
     */
    private Long postId;

    /**
     * 图片链接地址
     */
    private String imageUrl;

    /**
     * 图片排序序号
     */
    private Integer sortOrder;

    /**
     * 图片上传时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}