package com.taogexuefen.aethernet_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.dto.TaskCreateRequest;
import com.taogexuefen.aethernet_backend.model.dto.TaskQueryDTO;
import com.taogexuefen.aethernet_backend.model.entity.Task;
import com.taogexuefen.aethernet_backend.model.vo.TaskDetailVO;
import com.taogexuefen.aethernet_backend.model.vo.TaskVO;

public interface TaskService {
    /**
     * 发布任务
     * @param taskCreateRequest 任务创建请求
     * @param userId 用户ID
     * @return 任务ID
     */
    Long createTask(TaskCreateRequest taskCreateRequest, Long userId);

    /**
     * 获取任务列表
     * @param queryDTO 查询参数
     * @return 任务分页列表
     */
    Page<TaskVO> getTaskList(TaskQueryDTO queryDTO);

    /**
     * 获取任务详情
     * @param taskId 任务ID
     * @return 任务详情
     */
    TaskDetailVO getTaskDetail(Long taskId);

    /**
     * 接受任务
     * @param taskId 任务ID
     * @param userId 用户ID
     * @return 是否接受成功
     */
    boolean acceptTask(Long taskId, Long userId);

    /**
     * 完成任务
     * @param taskId 任务ID
     * @param userId 用户ID
     * @return 是否完成成功
     */
    boolean completeTask(Long taskId, Long userId);

    /**
     * 取消任务
     * @param taskId 任务ID
     * @param userId 用户ID
     * @return 是否取消成功
     */
    boolean cancelTask(Long taskId, Long userId);

    /**
     * 放弃已接受的任务（接单者主动放弃，任务重新开放）
     * @param taskId 任务ID
     * @param userId 用户ID
     * @return 是否放弃成功
     */
    boolean giveUpTask(Long taskId, Long userId);

    /**
     * 删除任务
     * @param taskId 任务ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteTask(Long taskId, Long userId);
}
