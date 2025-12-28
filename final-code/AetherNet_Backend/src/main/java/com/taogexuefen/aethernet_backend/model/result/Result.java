package com.taogexuefen.aethernet_backend.model.result;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * 统一响应结果类
 * 用于封装所有接口的返回结果，保证接口返回格式的一致性
 *
 * @param <T> 响应数据的类型
 */
@Data
public class Result<T> {
    /**
     * 响应码，200表示成功，其他表示失败
     */
    private Integer code;
    
    /**
     * 响应消息，描述操作结果
     */
    private String message;
    
    /**
     * 响应数据，具体业务数据
     */
    private T data;
    
    /**
     * 响应时间戳，记录接口响应的时间
     */
    private Long timestamp;

    public Result() {
        this.timestamp = LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    /**
     * 构造成功的响应结果
     *
     * @param data 响应数据
     * @param <T>  数据类型
     * @return 成功的响应结果
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    /**
     * 构造成功的响应结果（无数据）
     *
     * @param <T> 数据类型
     * @return 成功的响应结果
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }

    /**
     * 构造错误的响应结果
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 错误的响应结果
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(400, message, null);
    }

    /**
     * 构造错误的响应结果
     *
     * @param code    错误码
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 错误的响应结果
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}