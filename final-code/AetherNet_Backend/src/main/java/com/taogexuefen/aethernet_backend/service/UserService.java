package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.AdminCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserLoginRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.UserRegisterRequest;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.vo.UserLoginVO;
import com.taogexuefen.aethernet_backend.model.vo.UserRegisterVO;
import com.taogexuefen.aethernet_backend.model.vo.UserVO;

public interface UserService {
    /**
     * 用户注册
     * @param userRegisterRequest 用户注册请求
     * @return 用户注册响应
     */
    UserRegisterVO register(UserRegisterRequest userRegisterRequest);

    /**
     * 用户登录
     * @param userLoginRequest 用户登录请求
     * @return 用户登录响应
     */
    UserLoginVO login(UserLoginRequest userLoginRequest);

    /**
     * 创建管理员
     * @param adminCreateRequest 管理员创建请求
     * @return 创建的管理员用户信息
     */
    User createAdmin(AdminCreateRequest adminCreateRequest);

    /**
     * 根据用户ID获取用户信息
     * @param userId 用户ID
     * @return 用户实体
     */
    User getUserById(Long userId);

    /**
     * 根据学号获取用户信息
     * @param studentId 学号
     * @return 用户实体
     */
    User getUserByStudentId(String studentId);

    /**
     * 获取用户列表
     * @param queryDTO 查询参数
     * @return 用户分页列表
     */
    Page<UserVO> getUserList(UserQueryDTO queryDTO);

    /**
     * 更新用户状态
     * @param userId 用户ID
     * @param status 用户状态，0表示禁用，1表示启用
     * @return 是否更新成功
     */
    boolean updateUserStatus(Long userId, Integer status);

    /**
     * 更新用户个人信息
     * @param userId 用户ID
     * @param username 用户名
     * @param phone 手机号
     * @param email 邮箱
     * @param avatarUrl 头像链接
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 是否更新成功
     */
    boolean updateUserProfile(Long userId, String username, String phone, String email, String avatarUrl, String oldPassword, String newPassword);
}
