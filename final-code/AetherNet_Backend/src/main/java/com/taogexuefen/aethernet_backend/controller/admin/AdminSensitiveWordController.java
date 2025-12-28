package com.taogexuefen.aethernet_backend.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.entity.SensitiveWord;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.service.SensitiveWordService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/sensitive-words")
@RequiredArgsConstructor
@Tag(name = "管理端敏感词接口")
public class AdminSensitiveWordController {
    
    private final SensitiveWordService sensitiveWordService;
    
    /**
     * 添加敏感词
     */
    @PostMapping
    @Operation(summary = "添加敏感词")
    public Result<String> addSensitiveWord(@RequestBody SensitiveWord sensitiveWord) {
        // 参数校验
        if (sensitiveWord.getWord() == null || sensitiveWord.getWord().trim().isEmpty()) {
            return Result.error("敏感词不能为空");
        }
        
        if (sensitiveWord.getViolationType() == null || sensitiveWord.getViolationType().trim().isEmpty()) {
            return Result.error("违规类型不能为空");
        }
        
        // 设置创建时间
        sensitiveWord.setCreatedAt(LocalDateTime.now());
        
        // 保存到数据库
        sensitiveWordService.save(sensitiveWord);
        
        return Result.success("添加成功");
    }
    
    /**
     * 删除敏感词
     */
    @DeleteMapping("/{wordId}")
    @Operation(summary = "删除敏感词")
    public Result<String> deleteSensitiveWord(@PathVariable Long wordId) {
        sensitiveWordService.removeById(wordId);
        return Result.success("删除成功");
    }
    
    /**
     * 批量删除敏感词
     */
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除敏感词")
    public Result<String> batchDeleteSensitiveWords(@RequestBody List<Long> wordIds) {
        if (wordIds == null || wordIds.isEmpty()) {
            return Result.error("请选择要删除的敏感词");
        }
        
        sensitiveWordService.removeBatchByIds(wordIds);
        return Result.success("批量删除成功");
    }
    
    /**
     * 分页查询敏感词列表
     */
    @GetMapping("/page")
    @Operation(summary = "分页查询敏感词列表")
    public Result<PageResult<SensitiveWord>> getSensitiveWordPage(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        
        Page<SensitiveWord> pageParam = new Page<>(page, pageSize);
        Page<SensitiveWord> pageInfo = sensitiveWordService.page(pageParam);
        PageResult<SensitiveWord> pageResult = PageUtil.convert(pageInfo);
        
        return Result.success(pageResult);
    }
    
    /**
     * 查询所有敏感词列表
     */
    @GetMapping
    @Operation(summary = "查询所有敏感词列表")
    public Result<List<SensitiveWord>> getAllSensitiveWords() {
        List<SensitiveWord> sensitiveWords = sensitiveWordService.list();
        return Result.success(sensitiveWords);
    }
}