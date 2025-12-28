package com.taogexuefen.aethernet_backend.controller.student;

import com.taogexuefen.aethernet_backend.context.BaseContext;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@Tag(name = "学生端用户接口")
@Slf4j
public class StudentUserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "获取当前用户信息")
    public Result<User> getCurrentUserInfo() {
        try {
            Long userId = BaseContext.getCurrentId();
            User user = userService.getUserById(userId);
            if (user != null) {
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

    @PutMapping("/profile")
    @Operation(summary = "更新当前用户信息")
    public Result<Void> updateCurrentUserInfo(@RequestBody Map<String, Object> body) {
        try {
            Long userId = BaseContext.getCurrentId();
            if (userId == null) {
                return Result.error("用户未登录");
            }

            String username = body.get("username") instanceof String ? (String) body.get("username") : null;
            String name = body.get("name") instanceof String ? (String) body.get("name") : null;
            if (!StringUtils.hasText(username) && StringUtils.hasText(name)) {
                username = name;
            }

            String phone = body.get("phone") instanceof String ? (String) body.get("phone") : null;
            String email = body.get("email") instanceof String ? (String) body.get("email") : null;

            String avatarUrl = null;
            Object avatarUrlObj = body.get("avatarUrl");
            if (avatarUrlObj instanceof String) {
                avatarUrl = (String) avatarUrlObj;
            } else if (body.get("avatar") instanceof String) {
                avatarUrl = (String) body.get("avatar");
            }

            String oldPassword = body.get("oldPassword") instanceof String ? (String) body.get("oldPassword") : null;
            String newPassword = body.get("newPassword") instanceof String ? (String) body.get("newPassword") : null;

            boolean success = userService.updateUserProfile(userId, username, phone, email, avatarUrl, oldPassword, newPassword);
            if (success) {
                return Result.success();
            } else {
                return Result.error("更新用户信息失败");
            }
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            return Result.error("更新用户信息失败: " + e.getMessage());
        }
    }
}
