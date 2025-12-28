package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.config.JwtProperties;
import com.taogexuefen.aethernet_backend.constant.JwtClaimsConstant;
import com.taogexuefen.aethernet_backend.mapper.UserMapper;
import com.taogexuefen.aethernet_backend.model.dto.AdminCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserLoginRequest;
import com.taogexuefen.aethernet_backend.model.dto.UserQueryDTO;
import com.taogexuefen.aethernet_backend.model.dto.UserRegisterRequest;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.vo.UserInfoVO;
import com.taogexuefen.aethernet_backend.model.vo.UserLoginVO;
import com.taogexuefen.aethernet_backend.model.vo.UserRegisterVO;
import com.taogexuefen.aethernet_backend.model.vo.UserVO;
import com.taogexuefen.aethernet_backend.service.UserService;
import com.taogexuefen.aethernet_backend.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtProperties jwtProperties;

    @Override
    public UserRegisterVO register(UserRegisterRequest userRegisterRequest) {
        // 1. 校验学号是否已存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getStudentId, userRegisterRequest.getStudentId());
        if (userMapper.selectCount(queryWrapper) > 0) {
            throw new RuntimeException("该学号已被注册");
        }

        // 2. 创建用户
        User user = new User();
        BeanUtils.copyProperties(userRegisterRequest, user);
        // 密码加密
        user.setPassword(DigestUtils.md5DigestAsHex(userRegisterRequest.getPassword().getBytes()));
        user.setStatus(1); // 默认启用状态
        // 设置默认用户名
        user.setUsername("stu_" + user.getStudentId());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        // 3. 返回注册结果
        UserRegisterVO userRegisterVO = new UserRegisterVO();
        BeanUtils.copyProperties(user,userRegisterVO);
        return userRegisterVO;
    }

    @Override
    public UserLoginVO login(UserLoginRequest userLoginRequest) {
        // 1. 根据学号查询用户
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getStudentId, userLoginRequest.getStudentId());
        User user = userMapper.selectOne(queryWrapper);
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 2. 校验密码
        String encryptedPassword = DigestUtils.md5DigestAsHex(userLoginRequest.getPassword().getBytes());
        if (!encryptedPassword.equals(user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 3. 校验用户状态
        if (user.getStatus() != 1) {
            throw new RuntimeException("用户已被禁用");
        }

        // 4. 校验角色
        if (!user.getRole().equals(userLoginRequest.getRole())) {
            throw new RuntimeException("角色不匹配");
        }

        // 5. 生成JWT令牌
        UserInfoVO userInfoVO = new UserInfoVO();
        userInfoVO.setUserId(user.getUserId());
        userInfoVO.setStudentId(user.getStudentId());
        userInfoVO.setRole(user.getRole());

        UserLoginVO userLoginVO = new UserLoginVO();
        userLoginVO.setUser(userInfoVO);
        // 生成访问令牌
        Map<String,Object> claims =  new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID,user.getUserId());
        String token = JwtUtil.createJWT(jwtProperties.getSecret(),jwtProperties.getTtl(),claims);
        userLoginVO.setAccessToken(token);
        return userLoginVO;
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public User getUserByStudentId(String studentId) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getStudentId, studentId);
        return userMapper.selectOne(queryWrapper);
    }

    @Override
    public Page<UserVO> getUserList(UserQueryDTO queryDTO) {
        // 1. 构建分页对象
        Page<User> userPage = new Page<>(queryDTO.getPage(), queryDTO.getSize());

        // 2. 构建查询条件
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        
        // 状态筛选
        if (queryDTO.getStatus() != null) {
            queryWrapper.eq(User::getStatus, queryDTO.getStatus());
        }
        
        // 角色筛选
        if (queryDTO.getRole() != null && !queryDTO.getRole().isEmpty()) {
            queryWrapper.eq(User::getRole, queryDTO.getRole());
        }
        

        
        // 关键词搜索
        if (queryDTO.getKeyword() != null && !queryDTO.getKeyword().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper
                    .like(User::getStudentId, queryDTO.getKeyword())
                    .or()
                    .like(User::getUsername, queryDTO.getKeyword())
                    .or()
                    .like(User::getEmail, queryDTO.getKeyword())
                    .or()
                    .like(User::getPhone, queryDTO.getKeyword()));
        }

        // 按创建时间倒序排列
        queryWrapper.orderByDesc(User::getCreatedAt);

        // 3. 执行分页查询
        userMapper.selectPage(userPage, queryWrapper);

        // 4. 转换为VO对象
        Page<UserVO> voPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        voPage.setRecords(userPage.getRecords().stream().map(user -> {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return userVO;
        }).collect(java.util.stream.Collectors.toList()));

        return voPage;
    }

    @Override
    public boolean updateUserStatus(Long userId, Integer status) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        return userMapper.updateById(user) > 0;
    }

    @Override
    public User createAdmin(AdminCreateRequest adminCreateRequest) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, adminCreateRequest.getUsername());
        if (userMapper.selectCount(queryWrapper) > 0) {
            throw new RuntimeException("该用户名已被使用");
        }

        User user = new User();
        user.setUsername(adminCreateRequest.getUsername());
        user.setPassword(DigestUtils.md5DigestAsHex(adminCreateRequest.getPassword().getBytes()));
        user.setPhone(adminCreateRequest.getPhone());
        user.setRole("admin");
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userMapper.insert(user);
        
        // 不返回密码字段
        user.setPassword(null);
        return user;
    }

    @Override
    public boolean updateUserProfile(Long userId, String username, String phone, String email, String avatarUrl, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (StringUtils.hasText(username)) {
            user.setUsername(username);
        }

        if (StringUtils.hasText(phone)) {
            user.setPhone(phone);
        }

        if (StringUtils.hasText(email)) {
            user.setEmail(email);
        }

        if (StringUtils.hasText(avatarUrl)) {
            user.setAvatarUrl(avatarUrl);
        }

        if (StringUtils.hasText(oldPassword) || StringUtils.hasText(newPassword)) {
            if (!StringUtils.hasText(oldPassword) || !StringUtils.hasText(newPassword)) {
                throw new RuntimeException("密码参数不完整");
            }
            String encryptedOld = DigestUtils.md5DigestAsHex(oldPassword.getBytes());
            if (!encryptedOld.equals(user.getPassword())) {
                throw new RuntimeException("旧密码不正确");
            }
            String encryptedNew = DigestUtils.md5DigestAsHex(newPassword.getBytes());
            user.setPassword(encryptedNew);
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userMapper.updateById(user) > 0;
    }
}
