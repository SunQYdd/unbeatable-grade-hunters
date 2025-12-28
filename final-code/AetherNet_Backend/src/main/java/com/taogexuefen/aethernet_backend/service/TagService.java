package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.TagCreateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Tag;

import java.util.List;

public interface TagService {
    /**
     * 创建标签
     * @param tagCreateRequest 标签创建请求
     * @return 创建的标签
     */
    Tag createTag(TagCreateRequest tagCreateRequest);

    /**
     * 根据标签名模糊查询标签
     * @param tagName 标签名称（支持模糊查询）
     * @return 匹配的标签列表
     */
    List<Tag> searchTagsByName(String tagName);

    /**
     * 获取标签分页列表
     * @param page 页码
     * @param size 每页条数
     * @return 标签分页列表
     */
    Page<Tag> getTagList(int page, int size);
}