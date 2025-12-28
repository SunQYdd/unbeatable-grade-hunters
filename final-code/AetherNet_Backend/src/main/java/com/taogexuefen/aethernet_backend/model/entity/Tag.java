package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 标签实体类
 * 对应数据库表: tb_tags
 */
@Data
@TableName("tb_tags")
public class Tag {
    /**
     * 标签唯一标识符
     */
    @TableId(value = "tag_id", type = IdType.AUTO)
    private Long tagId;

    /**
     * 标签名称，如"二手书籍"、"代取快递"等
     */
    private String tagName;

    /**
     * 使用该标签的帖子数量统计
     */
    private Integer postCount;

    /**
     * 标签创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}