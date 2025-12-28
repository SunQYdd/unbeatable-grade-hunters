package com.taogexuefen.aethernet_backend.model.result;

import lombok.Data;
import java.util.List;

/**
 * 分页响应结果类
 * 用于封装分页查询的结果数据
 *
 * @param <T> 分页数据项的类型
 */
@Data
public class PageResult<T> {
    /**
     * 当前页码
     */
    private Integer currentPage;
    
    /**
     * 每页条数
     */
    private Integer pageSize;
    
    /**
     * 总记录数
     */
    private Long total;
    
    /**
     * 总页数
     */
    private Integer totalPages;
    
    /**
     * 当前页的数据列表
     */
    private List<T> records;
    
    /**
     * 是否有上一页
     */
    private Boolean hasPrevious;
    
    /**
     * 是否有下一页
     */
    private Boolean hasNext;

}