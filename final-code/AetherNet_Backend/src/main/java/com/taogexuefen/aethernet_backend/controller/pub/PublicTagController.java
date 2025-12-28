package com.taogexuefen.aethernet_backend.controller.pub;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.service.TagService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/tags")
@Tag(name = "公共标签接口")
@Slf4j
public class PublicTagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    @Operation(summary = "获取标签分页列表")
    public Result<PageResult<com.taogexuefen.aethernet_backend.model.entity.Tag>> getTagList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Page<com.taogexuefen.aethernet_backend.model.entity.Tag> tagPage = tagService.getTagList(page, size);
            PageResult<com.taogexuefen.aethernet_backend.model.entity.Tag> pageResult = PageUtil.convert(tagPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取标签列表失败", e);
            return Result.error("获取标签列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "根据标签名查询标签")
    public Result<List<com.taogexuefen.aethernet_backend.model.entity.Tag>> searchTagsByName(@RequestParam String tagName) {
        try {
            List<com.taogexuefen.aethernet_backend.model.entity.Tag> tags = tagService.searchTagsByName(tagName);
            return Result.success(tags);
        } catch (Exception e) {
            log.error("查询标签失败", e);
            return Result.error("查询标签失败: " + e.getMessage());
        }
    }
}