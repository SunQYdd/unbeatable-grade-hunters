package com.taogexuefen.aethernet_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.taogexuefen.aethernet_backend.model.entity.SensitiveWord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 敏感词Mapper接口
 */
@Mapper
public interface SensitiveWordMapper extends BaseMapper<SensitiveWord> {
    
}