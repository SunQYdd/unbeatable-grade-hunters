package com.taogexuefen.aethernet_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.taogexuefen.aethernet_backend.mapper.TaskMapper;
import com.taogexuefen.aethernet_backend.mapper.UserMapper;
import com.taogexuefen.aethernet_backend.model.dto.TaskCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.TaskQueryDTO;
import com.taogexuefen.aethernet_backend.model.entity.Task;
import com.taogexuefen.aethernet_backend.model.entity.User;
import com.taogexuefen.aethernet_backend.model.vo.TaskDetailVO;
import com.taogexuefen.aethernet_backend.model.vo.TaskVO;
import com.taogexuefen.aethernet_backend.model.vo.UserVO;
import com.taogexuefen.aethernet_backend.service.TaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@Slf4j
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional
    public Long createTask(TaskCreateRequest taskCreateRequest, Long userId) {
        Task task = new Task();
        BeanUtils.copyProperties(taskCreateRequest, task);
        if (!StringUtils.hasText(task.getType())) {
            task.setType("normal");
        }
        task.setPublisherId(userId);
        task.setStatus("open");
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        taskMapper.insert(task);

        return task.getTaskId();
    }

    @Override
    public Page<TaskVO> getTaskList(TaskQueryDTO queryDTO) {
        // 1. 构建分页对象
        Page<Task> taskPage = new Page<>(queryDTO.getPage(), queryDTO.getSize());

        LambdaQueryWrapper<Task> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(queryDTO.getStatus())) {
            queryWrapper.eq(Task::getStatus, queryDTO.getStatus());
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            queryWrapper.eq(Task::getType, queryDTO.getType());
        }

        if (queryDTO.getCategoryId() != null) {
            queryWrapper.eq(Task::getCategoryId, queryDTO.getCategoryId());
        }

        if (queryDTO.getPublisherId() != null) {
            queryWrapper.eq(Task::getPublisherId, queryDTO.getPublisherId());
        }

        if (queryDTO.getAccepterId() != null) {
            queryWrapper.eq(Task::getAssigneeId, queryDTO.getAccepterId());
        }

        if (Boolean.TRUE.equals(queryDTO.getUnassignedOnly())) {
            queryWrapper.isNull(Task::getAssigneeId);
        }

        if (queryDTO.getMinReward() != null) {
            queryWrapper.ge(Task::getReward, queryDTO.getMinReward());
        }
        
        if (queryDTO.getMaxReward() != null) {
            queryWrapper.le(Task::getReward, queryDTO.getMaxReward());
        }
        
        // 关键词搜索
        if (StringUtils.hasText(queryDTO.getKeyword())) {
            queryWrapper.and(wrapper -> wrapper
                    .like(Task::getTitle, queryDTO.getKeyword())
                    .or()
                    .like(Task::getDescription, queryDTO.getKeyword()));
        }

        // 排序
        switch (queryDTO.getSortBy()) {
            case "deadline":
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Task::getDeadline);
                break;
            case "reward":
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Task::getReward);
                break;
            default: // created_at
                queryWrapper.orderBy(true, "desc".equals(queryDTO.getOrder()), Task::getCreatedAt);
                break;
        }

        // 3. 执行分页查询
        taskMapper.selectPage(taskPage, queryWrapper);

        // 4. 转换为VO对象
        Page<TaskVO> voPage = new Page<>(taskPage.getCurrent(), taskPage.getSize(), taskPage.getTotal());
        voPage.setRecords(taskPage.getRecords().stream().map(this::convertToTaskVO).collect(java.util.stream.Collectors.toList()));

        return voPage;
    }

    @Override
    public TaskDetailVO getTaskDetail(Long taskId) {
        // 1. 查询任务信息
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 2. 转换为VO对象
        TaskDetailVO taskDetailVO = new TaskDetailVO();
        BeanUtils.copyProperties(task, taskDetailVO);

        // 3. 设置发布者信息
        User publisher = userMapper.selectById(task.getPublisherId());
        if (publisher != null) {
            UserVO publisherVO = new UserVO();
            publisherVO.setUserId(publisher.getUserId());
            publisherVO.setUsername(publisher.getUsername());
            publisherVO.setAvatarUrl(publisher.getAvatarUrl());
            taskDetailVO.setPublisher(publisherVO);
        }

        // 4. 设置接单者信息
        if (task.getAssigneeId() != null) {
            User assignee = userMapper.selectById(task.getAssigneeId());
            if (assignee != null) {
                UserVO assigneeVO = new UserVO();
                assigneeVO.setUserId(assignee.getUserId());
                assigneeVO.setUsername(assignee.getUsername());
                assigneeVO.setAvatarUrl(assignee.getAvatarUrl());
                taskDetailVO.setAssignee(assigneeVO);
            }
        }

        return taskDetailVO;
    }

    @Override
    @Transactional
    public boolean acceptTask(Long taskId, Long userId) {
        // 1. 查询任务信息
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 2. 校验任务状态
        if (!"open".equals(task.getStatus())) {
            throw new RuntimeException("任务状态不正确，无法接单");
        }

        // 3. 不能接自己发布的任务
        if (task.getPublisherId().equals(userId)) {
            throw new RuntimeException("不能接自己发布的任务");
        }

        // 4. 更新任务状态和接单者
        task.setAssigneeId(userId);
        task.setStatus("in_progress");
        task.setUpdatedAt(LocalDateTime.now());
        return taskMapper.updateById(task) > 0;
    }

    @Override
    @Transactional
    public boolean completeTask(Long taskId, Long userId) {
        // 1. 查询任务信息
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 2. 校验任务状态
        if (!"in_progress".equals(task.getStatus())) {
            throw new RuntimeException("任务状态不正确，无法完成");
        }

        // 3. 校验是否为任务接单者
        if (!task.getAssigneeId().equals(userId)) {
            throw new RuntimeException("无权限完成该任务");
        }

        // 4. 更新任务状态
        task.setStatus("completed");
        task.setCompletedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskMapper.updateById(task) > 0;
    }

    @Override
    @Transactional
    public boolean cancelTask(Long taskId, Long userId) {
        // 1. 查询任务信息
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 2. 校验是否为任务发布者
        if (!task.getPublisherId().equals(userId)) {
            throw new RuntimeException("无权限取消该任务");
        }

        // 3. 校验任务状态
        if (!"open".equals(task.getStatus()) && !"in_progress".equals(task.getStatus())) {
            throw new RuntimeException("任务状态不正确，无法取消");
        }

        // 4. 更新任务状态
        task.setStatus("cancelled");
        task.setUpdatedAt(LocalDateTime.now());
        return taskMapper.updateById(task) > 0;
    }

    @Override
    @Transactional
    public boolean giveUpTask(Long taskId, Long userId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        if (task.getAssigneeId() == null || !task.getAssigneeId().equals(userId)) {
            throw new RuntimeException("无权限放弃该任务");
        }

        if (!"in_progress".equals(task.getStatus())) {
            throw new RuntimeException("任务状态不正确，无法放弃");
        }

        task.setAssigneeId(null);
        task.setStatus("open");
        task.setUpdatedAt(LocalDateTime.now());
        return taskMapper.updateById(task) > 0;
    }

    @Override
    @Transactional
    public boolean deleteTask(Long taskId, Long userId) {
        // 1. 查询任务信息
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 2. 校验是否为任务发布者
        if (!task.getPublisherId().equals(userId)) {
            throw new RuntimeException("无权限删除该任务");
        }

        // 3. 删除任务
        return taskMapper.deleteById(taskId) > 0;
    }

    /**
     * 将Task实体转换为TaskVO
     * @param task Task实体
     * @return TaskVO对象
     */
    private TaskVO convertToTaskVO(Task task) {
        TaskVO taskVO = new TaskVO();
        BeanUtils.copyProperties(task, taskVO);

        // 设置发布者信息
        User publisher = userMapper.selectById(task.getPublisherId());
        if (publisher != null) {
            UserVO publisherVO = new UserVO();
            publisherVO.setUserId(publisher.getUserId());
            publisherVO.setUsername(publisher.getUsername());
            publisherVO.setAvatarUrl(publisher.getAvatarUrl());
            taskVO.setPublisher(publisherVO);
        }

        // 设置接单者信息
        if (task.getAssigneeId() != null) {
            User assignee = userMapper.selectById(task.getAssigneeId());
            if (assignee != null) {
                UserVO assigneeVO = new UserVO();
                assigneeVO.setUserId(assignee.getUserId());
                assigneeVO.setUsername(assignee.getUsername());
                assigneeVO.setAvatarUrl(assignee.getAvatarUrl());
                taskVO.setAssignee(assigneeVO);
            }
        }

        return taskVO;
    }
}
