package com.taogexuefen.aethernet_backend.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.AdminCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.UserStatusUpdateRequest;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.result.PageResult;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.UserVO;
import com.taogexuefen.aethernet_backend.service.UserService;
import com.taogexuefen.aethernet_backend.utils.PageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "管理员用户管理接口")
@Slf4j
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "获取用户列表")
    public Result<PageResult<UserVO>> getUserList(@RequestParam UserQueryDTO queryDTO) {
        try {
            Page<UserVO> userPage = userService.getUserList(queryDTO);
            PageResult<UserVO> pageResult = PageUtil.convert(userPage);
            return Result.success(pageResult);
        } catch (Exception e) {
            log.error("获取用户列表失败", e);
            return Result.error("获取用户列表失败: " + e.getMessage());
        }
    }

    @PostMapping("/admin")
    @Operation(summary = "新增管理员")
    public Result<User> createAdmin(@RequestBody AdminCreateRequest adminCreateRequest) {
        try {
            User user = userService.createAdmin(adminCreateRequest);
            return Result.success(user);
        } catch (Exception e) {
            log.error("创建管理员失败", e);
            return Result.error("创建管理员失败: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/status")
    @Operation(summary ="禁用/启用用户")
    public Result<Void> updateUserStatus(@PathVariable Long userId, @RequestBody UserStatusUpdateRequest request) {
        try {
            boolean success = userService.updateUserStatus(userId, request.getStatus());
            if (success) {
                return Result.success();
            } else {
                return Result.error("更新用户状态失败");
            }
        } catch (Exception e) {
            log.error("更新用户状态失败", e);
            return Result.error("更新用户状态失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}")
    @Operation(summary = "查看用户详细信息")
    public Result<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user != null) {
                // 不返回密码字段
                user.setPassword(null);
                return Result.success(user);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            return Result.error("获取用户信息失败: " + e.getMessage());
        }
    }
}