package com.taogexuefen.aethernet_backend.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.dto.PostModerateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostFeaturedRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostTopRequest;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.ModerationLogVO;
import com.taogexuefen.aethernet_backend.model.vo.PostVO;
import com.taogexuefen.aethernet_backend.service.AdminPostService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
@Tag(name = "管理员帖子管理接口")
@Slf4j
public class AdminPostController {

    @Autowired
    private AdminPostService adminPostService;

    @GetMapping("/pending")
    @Operation(summary = "获取待审核帖子列表")
    public Result<PageResult<PostVO>> getPendingPosts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Page<PostVO> postPage = adminPostService.getPendingPosts(page, size);
            PageResult<PostVO> pageResult = PageUtil.convert(postPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取待审核帖子列表失败", e);
            return Result.error("获取待审核帖子列表失败: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}/moderate")
    @Operation(summary ="审核帖子")
    public Result<Void> moderatePost(@PathVariable Long postId, @RequestBody PostModerateRequest request) {
        Long adminId = BaseContext.getCurrentId();
        try {
            boolean success = adminPostService.moderatePost(postId, request, adminId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("审核帖子失败");
            }
        } catch (Exception e) {
            log.error("审核帖子失败", e);
            return Result.error("审核帖子失败: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}/top")
    @Operation(summary ="置顶/取消置顶帖子")
    public Result<Void> topPost(@PathVariable Long postId, @RequestBody PostTopRequest request) {
        try {
            boolean success = adminPostService.topPost(postId, request);
            if (success) {
                return Result.success();
            } else {
                return Result.error("操作失败");
            }
        } catch (Exception e) {
            log.error("置顶/取消置顶帖子失败", e);
            return Result.error("操作失败: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}/featured")
    @Operation(summary ="设置/取消精华帖")
    public Result<Void> featurePost(@PathVariable Long postId, @RequestBody PostFeaturedRequest request) {
        try {
            boolean success = adminPostService.featurePost(postId, request);
            if (success) {
                return Result.success();
            } else {
                return Result.error("操作失败");
            }
        } catch (Exception e) {
            log.error("设置/取消精华帖失败", e);
            return Result.error("操作失败: " + e.getMessage());
        }
    }

    @GetMapping("/moderation/logs")
    @Operation(summary ="获取审核日志")
    public Result<PageResult<ModerationLogVO>> getModerationLogs(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long moderatorId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            Page<ModerationLogVO> logPage = adminPostService.getModerationLogs(page, size, moderatorId, startDate, endDate);
            PageResult<ModerationLogVO> pageResult = PageUtil.convert(logPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取审核日志失败", e);
            return Result.error("获取审核日志失败: " + e.getMessage());
        }
    }
}