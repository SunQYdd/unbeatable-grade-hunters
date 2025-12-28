package com.taogexuefen.aethernet_backend.controller.student;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.dto.TaskCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.TaskQueryDTO;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.TaskDetailVO;
import com.taogexuefen.aethernet_backend.model.vo.TaskVO;
import com.taogexuefen.aethernet_backend.service.TaskService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/tasks")
@Tag(name = "学生端任务接口")
@Slf4j
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    @Operation(summary = "发布任务")
    public Result<Long> createTask(@RequestBody TaskCreateRequest request) {
        Long userId = BaseContext.getCurrentId();
        try {
            Long taskId = taskService.createTask(request, userId);
            return Result.success(taskId);
        } catch (Exception e) {
            log.error("发布任务失败", e);
            return Result.error("发布任务失败: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary ="获取任务列表")
    public Result<PageResult<TaskVO>> getTaskList(TaskQueryDTO queryDTO) {
        try {
            Page<TaskVO> taskPage = taskService.getTaskList(queryDTO);
            PageResult<TaskVO> pageResult = PageUtil.convert(taskPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取任务列表失败", e);
            return Result.error("获取任务列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{taskId}")
    @Operation(summary ="获取任务详情")
    public Result<TaskDetailVO> getTaskDetail(@PathVariable Long taskId) {
        try {
            TaskDetailVO taskDetail = taskService.getTaskDetail(taskId);
            return Result.success(taskDetail);
        } catch (Exception e) {
            log.error("获取任务详情失败", e);
            return Result.error("获取任务详情失败: " + e.getMessage());
        }
    }

    @PostMapping("/{taskId}/accept")
    @Operation(summary ="接受任务")
    public Result<Void> acceptTask(@PathVariable Long taskId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = taskService.acceptTask(taskId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("接受任务失败");
            }
        } catch (Exception e) {
            log.error("接受任务失败", e);
            return Result.error("接受任务失败: " + e.getMessage());
        }
    }

    @PostMapping("/{taskId}/complete")
    @Operation(summary ="完成任务")
    public Result<Void> completeTask(@PathVariable Long taskId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = taskService.completeTask(taskId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("完成任务失败");
            }
        } catch (Exception e) {
            log.error("完成任务失败", e);
            return Result.error("完成任务失败: " + e.getMessage());
        }
    }

    @PostMapping("/{taskId}/cancel")
    @Operation(summary ="取消任务")
    public Result<Void> cancelTask(@PathVariable Long taskId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = taskService.cancelTask(taskId,userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("取消任务失败");
            }
        } catch (Exception e) {
            log.error("取消任务失败", e);
            return Result.error("取消任务失败: " + e.getMessage());
        }
    }

    @PostMapping("/{taskId}/giveup")
    @Operation(summary ="放弃任务（接单者）")
    public Result<Void> giveUpTask(@PathVariable Long taskId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = taskService.giveUpTask(taskId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("放弃任务失败");
            }
        } catch (Exception e) {
            log.error("放弃任务失败", e);
            return Result.error("放弃任务失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{taskId}")
    @Operation(summary ="删除任务")
    public Result<Void> deleteTask(@PathVariable Long taskId) {
        Long userId = BaseContext.getCurrentId();
        try {
            boolean success = taskService.deleteTask(taskId, userId);
            if (success) {
                return Result.success();
            } else {
                return Result.error("删除任务失败");
            }
        } catch (Exception e) {
            log.error("删除任务失败", e);
            return Result.error("删除任务失败: " + e.getMessage());
        }
    }
}
