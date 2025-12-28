package com.taogexuefen.aethernet_backend.controller.pub;

import com.taogexuefen.aethernet_backend.model.dto.UserLoginRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserRegisterRequest;
import com.taogexuefen.aethernet_backend.model.result.Result;
import com.taogexuefen.aethernet_backend.model.vo.UserLoginVO;
import com.taogexuefen.aethernet_backend.model.vo.UserRegisterVO;
import com.taogexuefen.aethernet_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Tag(name = "公共认证接口")
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<UserRegisterVO> register(@RequestBody UserRegisterRequest userRegisterRequest) {
        try {
            // 参数校验
            if (userRegisterRequest.getStudentId() == null || userRegisterRequest.getStudentId().isEmpty()) {
                return Result.error("学号不能为空");
            }
            if (userRegisterRequest.getPassword() == null || userRegisterRequest.getPassword().isEmpty()) {
                return Result.error("密码不能为空");
            }
            if (userRegisterRequest.getPhone() == null || userRegisterRequest.getPhone().isEmpty()) {
                return Result.error("手机号不能为空");
            }
            if (userRegisterRequest.getRole() == null || userRegisterRequest.getRole().isEmpty()) {
                return Result.error("角色不能为空");
            }

            UserRegisterVO userRegisterVO = userService.register(userRegisterRequest);
            return Result.success(userRegisterVO);
        } catch (Exception e) {
            log.error("用户注册失败", e);
            return Result.error("注册失败: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary ="用户登录")
    public Result<UserLoginVO> login(@RequestBody UserLoginRequest userLoginRequest) {
        try {
            // 参数校验
            if (userLoginRequest.getStudentId() == null || userLoginRequest.getStudentId().isEmpty()) {
                return Result.error("学号不能为空");
            }
            if (userLoginRequest.getPassword() == null || userLoginRequest.getPassword().isEmpty()) {
                return Result.error("密码不能为空");
            }
            if (userLoginRequest.getRole() == null || userLoginRequest.getRole().isEmpty()) {
                return Result.error("角色不能为空");
            }

            UserLoginVO userLoginVO = userService.login(userLoginRequest);
            return Result.success(userLoginVO);
        } catch (Exception e) {
            log.error("用户登录失败", e);
            return Result.error("登录失败: " + e.getMessage());
        }
    }
}