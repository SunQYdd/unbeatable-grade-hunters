package com.taogexuefen.aethernet_backend.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 敏感词实体类
 */
@Data
@TableName("tb_sensitive_words")
public class SensitiveWord {
    
    /**
     * 敏感词唯一标识符
     */
    @TableId(type = IdType.AUTO)
    private Long wordId;
    
    /**
     * 敏感词内容
     */
    private String word;
    
    /**
     * 违规类型
     */
    private String violationType;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}