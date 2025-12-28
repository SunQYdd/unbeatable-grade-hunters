package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库表: tb_users
 */
@Data
@TableName("tb_users")
public class User {
    /**
     * 用户唯一标识符
     */
    @TableId(value = "user_id", type = IdType.AUTO)
    private Long userId;

    /**
     * 用户名，用于登录和显示
     */
    private String username;

    /**
     * 密码哈希值，采用安全加密算法存储
     */
    private String password;

    /**
     * 邮箱地址，用于账户验证和联系
     */
    private String email;

    /**
     * 学号，用于验证学生身份
     */
    private String studentId;

    /**
     * 用户角色，区分普通学生和管理员
     */
    private String role;

    /**
     * 用户头像图片链接
     */
    private String avatarUrl;

    /**
     * 手机号码，用于联系和验证
     */
    private String phone;

    /**
     * 用户状态，1表示正常，0表示禁用
     */
    private Integer status;

    @TableField("fame")
    private Integer creditScore;

    /**
     * 用户注册时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 用户信息最后更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
