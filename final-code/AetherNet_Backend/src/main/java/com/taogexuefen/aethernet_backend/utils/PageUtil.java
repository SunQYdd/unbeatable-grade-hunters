package com.taogexuefen.aethernet_backend.utils;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.taogexuefen.aethernet_backend.model.result.PageResult;

/**
 * 分页工具类
 * 用于将MyBatis Plus的Page对象转换为自定义的PageResult对象
 */
public class PageUtil {

    /**
     * 将MyBatis Plus的Page对象转换为PageResult对象
     *
     * @param page MyBatis Plus分页对象
     * @param <T>  数据项类型
     * @return PageResult对象
     */
    public static <T> PageResult<T> convert(Page<T> page) {
        PageResult<T> pageResult = new PageResult<>();
        pageResult.setCurrentPage((int) page.getCurrent());
        pageResult.setPageSize((int) page.getSize());
        pageResult.setTotal(page.getTotal());
        pageResult.setTotalPages((int) page.getPages());
        pageResult.setRecords(page.getRecords());
        pageResult.setHasPrevious(page.hasPrevious());
        pageResult.setHasNext(page.hasNext());
        return pageResult;
    }
}