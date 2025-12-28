package com.taogexuefen.aethernet_backend.model.dto;

import lombok.Data;

/**
 * 用户查询参数DTO
 */
@Data
public class UserQueryDTO {
    /**
     * 页码，默认为1
     */
    private Integer page = 1;

    /**
     * 每页条数，默认为10
     */
    private Integer size = 10;

    /**
     * 用户状态筛选，1表示正常，0表示禁用
     */
    private Integer status;

    /**
     * 用户角色筛选
     */
    private String role;


    /**
     * 关键词搜索
     */
    private String keyword;
}