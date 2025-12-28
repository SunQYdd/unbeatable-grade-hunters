package com.taogexuefen.aethernet_backend.controller.student;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.dto.CommentCreateRequest;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.CommentVO;
import com.taogexuefen.aethernet_backend.model.vo.LikeResponse;
import com.taogexuefen.aethernet_backend.service.CommentService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@Tag(name = "学生端评论接口")
@Slf4j
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/comments")
    @Operation(summary = "发布评论")
    public Result<Long> createComment(@RequestBody CommentCreateRequest request) {
        Long userId = BaseContext.getCurrentId();
        try {
            Long commentId = commentService.createComment(request, userId);
            return Result.success(commentId);
        } catch (Exception e) {
            log.error("发布评论失败", e);
            return Result.error("发布评论失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary ="删除自己的评论")
    public Result<Void> deleteComment(@PathVariable Long commentId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = commentService.deleteComment(commentId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("删除评论失败");
            }
        } catch (Exception e) {
            log.error("删除评论失败", e);
            return Result.error("删除评论失败: " + e.getMessage());
        }
    }

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary ="获取帖子评论列表")
    public Result<PageResult<CommentVO>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {
        try {
            Long userId = BaseContext.getCurrentId();
            Page<CommentVO> commentPage = commentService.getPostComments(postId, page, size, sortBy, order, userId);
            PageResult<CommentVO> pageResult = PageUtil.convert(commentPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取帖子评论列表失败", e);
            return Result.error("获取帖子评论列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/comments/{commentId}/replies")
    @Operation(summary ="获取评论的直接回复列表")
    public Result<PageResult<CommentVO>> getCommentReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        try {
            Long userId = BaseContext.getCurrentId();
            Page<CommentVO> commentPage = commentService.getCommentReplies(commentId, page, size, sortBy, order, userId);
            PageResult<CommentVO> pageResult = PageUtil.convert(commentPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取评论回复列表失败", e);
            return Result.error("获取评论回复列表失败: " + e.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/like")
    @Operation(summary ="点赞/取消点赞评论")
    public Result<LikeResponse> likeComment(@PathVariable Long commentId) {
        Long userId = BaseContext.getCurrentId();
        try {
            CommentService.LikeResult likeResult = commentService.likeComment(commentId, userId);
            LikeResponse response = new LikeResponse();
            response.setIsLiked(likeResult.getIsLiked());
            response.setLikeCount(likeResult.getLikeCount());
            return Result.success(response);
        } catch (Exception e) {
            log.error("点赞评论失败", e);
            return Result.error("点赞评论失败: " + e.getMessage());
        }
    }
}