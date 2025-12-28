package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.TagMapper;
import com.taogexuefen.aethernet_backend.model.dto.TagCreateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Tag;
import com.taogexuefen.aethernet_backend.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Override
    public Tag createTag(TagCreateRequest tagCreateRequest) {
        // 1. 检查标签是否已存在
        LambdaQueryWrapper<Tag> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Tag::getTagName, tagCreateRequest.getTagName());
        if (tagMapper.selectCount(queryWrapper) > 0) {
            throw new RuntimeException("标签已存在");
        }

        // 2. 创建标签
        Tag tag = new Tag();
        BeanUtils.copyProperties(tagCreateRequest, tag);
        tag.setPostCount(0); // 新标签初始帖子数为0
        tag.setCreatedAt(LocalDateTime.now());
        tagMapper.insert(tag);
        
        return tag;
    }

    @Override
    public List<Tag> searchTagsByName(String tagName) {
        // 模糊查询标签
        LambdaQueryWrapper<Tag> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(Tag::getTagName, tagName);
        queryWrapper.orderByDesc(Tag::getPostCount); // 按帖子数降序排列
        
        return tagMapper.selectList(queryWrapper);
    }

    @Override
    public Page<Tag> getTagList(int page, int size) {
        // 分页查询标签
        Page<Tag> tagPage = new Page<>(page, size);
        LambdaQueryWrapper<Tag> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(Tag::getPostCount); // 按帖子数降序排列
        tagMapper.selectPage(tagPage, queryWrapper);
        
        return tagPage;
    }
}