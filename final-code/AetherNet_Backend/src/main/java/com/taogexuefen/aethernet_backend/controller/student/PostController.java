package com.taogexuefen.aethernet_backend.controller.student;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.dto.PostCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostGenerateRequest;
import com.taogexuefen.aethernet_backend.model.dto.PostQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.PostUpdateRequest;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.*;
import com.taogexuefen.aethernet_backend.service.PostService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/posts")
@Tag(name = "学生端帖子接口")
@Slf4j
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    @Operation(summary = "发布帖子")
    public Result<Long> createPost(@RequestBody PostCreateRequest request) {
        Long userId = BaseContext.getCurrentId();
        try {
            Long postId = postService.createPost(request, userId);
            return Result.success(postId);
        } catch (Exception e) {
            log.error("发布帖子失败", e);
            return Result.error("发布帖子失败: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}")
    @Operation(summary ="编辑帖子")
    public Result<Long> updatePost(@PathVariable Long postId, @RequestBody PostUpdateRequest request) {
        Long userId = BaseContext.getCurrentId();
        try {
            Long updatedPostId = postService.updatePost(postId, request, userId);
            return Result.success(updatedPostId);
        } catch (Exception e) {
            log.error("编辑帖子失败", e);
            return Result.error("编辑帖子失败: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary ="获取帖子列表")
    public Result<PageResult<PostVO>> getPostList(@ModelAttribute PostQueryDTO queryDTO) {
        try {
            Long userId = BaseContext.getCurrentId();
            Page<PostVO> postPage = postService.getPostList(queryDTO, userId);
            PageResult<PostVO> pageResult = PageUtil.convert(postPage);
            
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取帖子列表失败", e);
            return Result.error("获取帖子列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{postId}")
    @Operation(summary ="获取帖子详情")
    public Result<PostDetailVO> getPostDetail(@PathVariable Long postId) {
        Long userId = BaseContext.getCurrentId();
        try {
            PostDetailVO postDetail = postService.getPostDetail(postId, userId);
            return Result.success(postDetail);
        } catch (Exception e) {
            log.error("获取帖子详情失败", e);
            return Result.error("获取帖子详情失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{postId}")
    @Operation(summary ="删除自己的帖子")
    public Result<Void> deletePost(@PathVariable Long postId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = postService.deletePost(postId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("删除帖子失败");
            }
        } catch (Exception e) {
            log.error("删除帖子失败", e);
            return Result.error("删除帖子失败: " + e.getMessage());
        }
    }

    @PostMapping("/{postId}/like")
    @Operation(summary ="点赞/取消点赞帖子")
    public Result<LikeResponse> likePost(@PathVariable Long postId) {
        Long userId = BaseContext.getCurrentId();
        try {
            PostService.LikeResult likeResult = postService.likePost(postId, userId);
            LikeResponse response = new LikeResponse();
            response.setIsLiked(likeResult.getIsLiked());
            response.setLikeCount(likeResult.getLikeCount());
            return Result.success(response);
        } catch (Exception e) {
            log.error("点赞帖子失败", e);
            return Result.error("点赞帖子失败: " + e.getMessage());
        }
    }

    @PostMapping("/{postId}/favorite")
    @Operation(summary ="收藏/取消收藏帖子")
    public Result<FavoriteResponse> favoritePost(@PathVariable Long postId) {
        Long userId = BaseContext.getCurrentId();
        try {
            PostService.FavoriteResult favoriteResult = postService.favoritePost(postId, userId);
            FavoriteResponse response = new FavoriteResponse();
            response.setIsFavorited(favoriteResult.getIsFavorited());
            return Result.success(response);
        } catch (Exception e) {
            log.error("收藏帖子失败", e);
            return Result.error("收藏帖子失败: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    @Operation(summary = "根据提示词生成帖子草稿内容")
    public Result<PostGeneratedVO> generatePostContent(@RequestBody PostGenerateRequest request) {
        try {
            if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
                return Result.error("提示词不能为空");
            }
            PostGeneratedVO generated = postService.generatePost(request.getPrompt());
            return Result.success(generated);
        } catch (Exception e) {
            log.error("生成帖子内容失败", e);
            return Result.error("生成失败: " + e.getMessage());
        }
    }
}
