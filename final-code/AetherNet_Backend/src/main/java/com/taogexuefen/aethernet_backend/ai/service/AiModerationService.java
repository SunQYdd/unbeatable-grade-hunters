package com.taogexuefen.aethernet_backend.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taogexuefen.aethernet_backend.ai.model.AiModerationRequest;
import com.taogexuefen.aethernet_backend.ai.model.AiModerationResponse;
import com.taogexuefen.aethernet_backend.model.entity.SensitiveWord;
import com.taogexuefen.aethernet_backend.service.SensitiveWordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiModerationService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final SensitiveWordService sensitiveWordService;

    public AiModerationResponse moderate(AiModerationRequest request) {
        // 根据敏感词库筛选
        // 获得敏感词列表
        List<SensitiveWord> sensitiveWordList = sensitiveWordService.list();
        String sensitiveWordJSON = "";
        try{
            sensitiveWordJSON = objectMapper.writeValueAsString(sensitiveWordList);
        }catch (JsonProcessingException e){
            log.error("敏感词数据转json失败！！！");
        }



        Resource promptResource = new org.springframework.core.io.ClassPathResource("prompts/ai_moderation_prompt.st");
        PromptTemplate promptTemplate = new PromptTemplate(promptResource);


        Prompt prompt = promptTemplate.create(
                Map.of(
                        "sensitive",sensitiveWordJSON,
                        "title", request.getTitle(),
                        "content", request.getContent()
                )
        );

        String responseText = chatClient.prompt(prompt).call().content();

        try {
            // 尝试解析 JSON
            return objectMapper.readValue(responseText, AiModerationResponse.class);
        } catch (Exception e) {
            log.warn("AI 审核响应解析失败，原始内容: {}", responseText, e);
            // 降级策略：拒绝 + 高风险
            AiModerationResponse fallback = new AiModerationResponse();
            fallback.setDecision("rejected");
            fallback.setRiskLevel("high");
            fallback.setReason("AI 审核结果格式异常，请人工复核");
            return fallback;
        }
    }
}