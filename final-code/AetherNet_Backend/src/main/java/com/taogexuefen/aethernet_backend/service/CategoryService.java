package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.CategoryCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.CategoryQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.CategoryUpdateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Category;
import com.taogexuefen.aethernet_backend.model.vo.CategoryVO;
import java.util.List;

public interface CategoryService {
    /**
     * 获取所有分类列表（用于公共接口）
     * @return 分类列表
     */
    List<CategoryVO> getAllCategories();

    /**
     * 获取分类分页列表（用于管理员接口）
     * @param queryDTO 查询参数
     * @return 分类分页列表
     */
    Page<Category> getCategoryList(CategoryQueryDTO queryDTO);

    /**
     * 根据ID获取分类详情
     * @param categoryId 分类ID
     * @return 分类实体
     */
    Category getCategoryById(Long categoryId);

    /**
     * 创建分类
     * @param categoryCreateRequest 分类创建请求
     * @return 创建的分类
     */
    Category createCategory(CategoryCreateRequest categoryCreateRequest);

    /**
     * 更新分类
     * @param categoryId 分类ID
     * @param categoryUpdateRequest 分类更新请求
     * @return 更新后的分类
     */
    Category updateCategory(Long categoryId, CategoryUpdateRequest categoryUpdateRequest);

    /**
     * 删除分类
     * @param categoryId 分类ID
     * @return 是否删除成功
     */
    boolean deleteCategory(Long categoryId);
}