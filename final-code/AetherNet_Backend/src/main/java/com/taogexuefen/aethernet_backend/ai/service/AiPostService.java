package com.taogexuefen.aethernet_backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.taogexuefen.aethernet_backend.model.vo.PostGeneratedVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiPostService {
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public PostGeneratedVO generatePost(String input) {
        Resource promptResource = new org.springframework.core.io.ClassPathResource("prompts/ai_generate_post_prompt.st");
        PromptTemplate promptTemplate = new PromptTemplate(promptResource);


        Prompt prompt = promptTemplate.create(
                Map.of(
                        "prompt", input
                )
        );

        String responseText = chatClient.prompt(prompt).call().content();

        try {
            // 尝试解析 JSON
            return objectMapper.readValue(responseText, PostGeneratedVO.class);
        } catch (Exception e) {
            log.warn("AI 审核响应解析失败，原始内容: {}", responseText, e);
            return new PostGeneratedVO();
        }
    }
}
