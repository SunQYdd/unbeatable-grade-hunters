package com.taogexuefen.aethernet_backend.controller.student;

import com.taogexuefen.aethernet_backend.model.dto.TagCreateRequest;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/tags")
@Tag(name = "学生端标签接口")
@Slf4j
public class StudentTagController {

    @Autowired
    private TagService tagService;

    @PostMapping
    @Operation(summary = "创建标签")
    public Result<com.taogexuefen.aethernet_backend.model.entity.Tag> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
        try {
            com.taogexuefen.aethernet_backend.model.entity.Tag tag = tagService.createTag(tagCreateRequest);
            return Result.success(tag);
        } catch (Exception e) {
            log.error("创建标签失败", e);
            return Result.error("创建标签失败: " + e.getMessage());
        }
    }
}