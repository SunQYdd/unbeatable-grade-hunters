package com.taogexuefen.aethernet_backend.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.CategoryCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.CategoryQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.CategoryUpdateRequest;
import com.taogexuefen.aethernet_backend.model.entity.Category;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.service.CategoryService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@Tag(name = "管理员分类管理接口")
@Slf4j
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @Operation(summary = "获取分类分页列表")
    public Result<PageResult<Category>> getCategoryList(CategoryQueryDTO queryDTO) {
        try {
            Page<Category> categoryPage = categoryService.getCategoryList(queryDTO);
            PageResult<Category> pageResult = PageUtil.convert(categoryPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取分类列表失败", e);
            return Result.error("获取分类列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "获取分类详情")
    public Result<Category> getCategoryById(@PathVariable Long categoryId) {
        try {
            Category category = categoryService.getCategoryById(categoryId);
            if (category != null) {
                return Result.success(category);
            } else {
                return Result.error("分类不存在");
            }
        } catch (Exception e) {
            log.error("获取分类详情失败", e);
            return Result.error("获取分类详情失败: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "新增分类")
    public Result<Category> createCategory(@RequestBody CategoryCreateRequest categoryCreateRequest) {
        try {
            Category category = categoryService.createCategory(categoryCreateRequest);
            return Result.success(category);
        } catch (Exception e) {
            log.error("新增分类失败", e);
            return Result.error("新增分类失败: " + e.getMessage());
        }
    }

    @PutMapping("/{categoryId}")
    @Operation(summary = "修改分类")
    public Result<Category> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        try {
            Category category = categoryService.updateCategory(categoryId, categoryUpdateRequest);
            return Result.success(category);
        } catch (Exception e) {
            log.error("修改分类失败", e);
            return Result.error("修改分类失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{categoryId}")
    @Operation(summary = "删除分类")
    public Result<Void> deleteCategory(@PathVariable Long categoryId) {
        try {
            boolean success = categoryService.deleteCategory(categoryId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("分类不存在或删除失败");
            }
        } catch (Exception e) {
            log.error("删除分类失败", e);
            return Result.error("删除分类失败: " + e.getMessage());
        }
    }
}