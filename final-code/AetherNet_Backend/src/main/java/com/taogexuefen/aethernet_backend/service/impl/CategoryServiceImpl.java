package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.CategoryMapper;
import com.taogexuefen.aethernet_backend.model.dto.CategoryCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.CategoryQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.CategoryUpdateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Category;
import com.taogexuefen.aethernet_backend.model.vo.CategoryVO;
import com.taogexuefen.aethernet_backend.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<CategoryVO> getAllCategories() {
        // 查询所有分类
        List<Category> categories = categoryMapper.selectList(null);
        
        // 转换为VO对象
        return categories.stream().map(category -> {
            CategoryVO categoryVO = new CategoryVO();
            categoryVO.setCategoryId(category.getCategoryId());
            categoryVO.setCategoryName(category.getCategoryName());
            categoryVO.setCategoryCode(category.getCategoryCode());
            return categoryVO;
        }).collect(Collectors.toList());
    }

    @Override
    public Page<Category> getCategoryList(CategoryQueryDTO queryDTO) {
        // 1. 构建分页对象
        Page<Category> categoryPage = new Page<>(queryDTO.getPage(), queryDTO.getSize());

        // 2. 构建查询条件
        LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
        
        // 关键词搜索
        if (StringUtils.hasText(queryDTO.getKeyword())) {
            queryWrapper.like(Category::getCategoryName, queryDTO.getKeyword())
                    .or()
                    .like(Category::getCategoryCode, queryDTO.getKeyword());
        }

        // 按排序序号升序、创建时间降序排列
        queryWrapper.orderByAsc(Category::getSortOrder)
                .orderByDesc(Category::getCreatedAt);

        // 3. 执行分页查询
        categoryMapper.selectPage(categoryPage, queryWrapper);

        return categoryPage;
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryMapper.selectById(categoryId);
    }

    @Override
    public Category createCategory(CategoryCreateRequest categoryCreateRequest) {
        // 1. 创建分类对象
        Category category = new Category();
        BeanUtils.copyProperties(categoryCreateRequest, category);
        category.setCreatedAt(LocalDateTime.now());
        
        // 2. 插入数据库
        categoryMapper.insert(category);
        
        return category;
    }

    @Override
    public Category updateCategory(Long categoryId, CategoryUpdateRequest categoryUpdateRequest) {
        // 1. 查询分类是否存在
        Category category = categoryMapper.selectById(categoryId);
        if (category == null) {
            throw new RuntimeException("分类不存在");
        }

        // 2. 更新分类信息
        BeanUtils.copyProperties(categoryUpdateRequest, category);
        categoryMapper.updateById(category);
        
        return category;
    }

    @Override
    public boolean deleteCategory(Long categoryId) {
        // 1. 查询分类是否存在
        Category category = categoryMapper.selectById(categoryId);
        if (category == null) {
            return false;
        }

        // 2. 删除分类
        return categoryMapper.deleteById(categoryId) > 0;
    }
}