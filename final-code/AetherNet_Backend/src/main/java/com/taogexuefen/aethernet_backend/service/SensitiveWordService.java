package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.taogexuefen.aethernet_backend.model.entity.SensitiveWord;

/**
 * 敏感词服务接口
 */
public interface SensitiveWordService extends IService<SensitiveWord> {
    
    /**
     * 分页查询敏感词
     * @param page 分页参数
     * @return 分页结果
     */
    Page<SensitiveWord> getSensitiveWordPage(Page<SensitiveWord> page);
}