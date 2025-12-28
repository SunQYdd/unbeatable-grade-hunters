package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.SensitiveWordMapper;
import com.taogexuefen.aethernet_backend.model.entity.SensitiveWord;
import com.taogexuefen.aethernet_backend.service.SensitiveWordService;
import org.springframework.stereotype.Service;

/**
 * 敏感词服务实现类
 */
@Service
public class SensitiveWordServiceImpl extends ServiceImpl<SensitiveWordMapper, SensitiveWord> implements SensitiveWordService {
    
    @Override
    public Page<SensitiveWord> getSensitiveWordPage(Page<SensitiveWord> page) {
        return this.page(page);
    }
}