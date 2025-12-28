package com.taogexuefen.aethernet_backend.ai.model;

import lombok.Data;

/**
 * ai 智能审核请求类
 */
@Data
public class AiModerationRequest {
    private String title;
    private String content;

    public static AiModerationRequest of(String title, String content) {
        AiModerationRequest req = new AiModerationRequest();
        req.title = title;
        req.content = content;
        return req;
    }

}