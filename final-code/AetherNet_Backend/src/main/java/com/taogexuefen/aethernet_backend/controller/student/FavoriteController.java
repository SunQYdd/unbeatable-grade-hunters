package com.taogexuefen.aethernet_backend.controller.student;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.FavoriteVO;
import com.taogexuefen.aethernet_backend.service.PostService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/favorites")
@Tag(name = "学生端收藏接口")
@Slf4j
public class FavoriteController {

    @Autowired
    private PostService postService;

    @GetMapping
    @Operation(summary = "获取我的收藏列表")
    public Result<PageResult<FavoriteVO>> getFavorites(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Long userId = BaseContext.getCurrentId();
        try {
            Page<FavoriteVO> favoritePage = postService.getFavorites(page, size, userId);
            PageResult<FavoriteVO> pageResult = PageUtil.convert(favoritePage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取收藏列表失败", e);
            return Result.error("获取收藏列表失败: " + e.getMessage());
        }
    }
}

