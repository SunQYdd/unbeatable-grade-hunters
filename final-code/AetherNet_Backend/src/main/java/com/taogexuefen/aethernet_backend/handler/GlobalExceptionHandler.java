package com.taogexuefen.aethernet_backend.handler;

import com.taogexuefen.aethernet_backend.model.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.ConnectException;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理类
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理所有未捕获的异常
     *
     * @param ex 异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(Exception.class)
    public Result<Map<String, String>> handleException(Exception ex) {
        log.error("系统异常：", ex);

        Map<String, String> error = new HashMap<>();
        error.put("message", "系统异常，请联系管理员");
        error.put("details", ex.getMessage());

        return Result.error(error.toString());
    }


    /**
     * 处理参数验证异常
     *
     * @param ex 参数验证异常对象
     * @return 错误响应结果
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public Result<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("参数验证异常：", ex);

        Map<String, String> error = new HashMap<>();
        error.put("message", "参数验证失败：" + ex.getMessage());

        return Result.error("参数验证失败：" );
    }


    @ExceptionHandler(ConnectException.class)
    public Result handleConnectException(ConnectException ex){
        log.error("连接异常");
        Map<String, String> error = new HashMap<>();
        error.put("message", "连接异常：" + ex.getMessage());

        return Result.error(error.toString());
    }

}