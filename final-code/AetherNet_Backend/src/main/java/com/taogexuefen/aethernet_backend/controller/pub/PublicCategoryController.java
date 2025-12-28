package com.taogexuefen.aethernet_backend.controller.pub;

import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.CategoryVO;
import com.taogexuefen.aethernet_backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@Tag(name = "公共分类接口")
@Slf4j
public class PublicCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @Operation(summary = "获取所有分类列表")
    public Result<List<CategoryVO>> getAllCategories() {
        try {
            List<CategoryVO> categories = categoryService.getAllCategories();
            return Result.success(categories);
        } catch (Exception e) {
            log.error("获取分类列表失败", e);
            return Result.error("获取分类列表失败: " + e.getMessage());
        }
    }
}