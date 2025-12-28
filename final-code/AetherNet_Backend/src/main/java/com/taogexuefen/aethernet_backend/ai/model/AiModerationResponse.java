package com.taogexuefen.aethernet_backend.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * ai 智能审核响应类
 */
@Data
public class AiModerationResponse {
    @JsonProperty("decision")
    private String decision; // "approved" or "rejected"

    @JsonProperty("riskLevel")
    private String riskLevel; // "low", "medium", "high"

    @JsonProperty("reason")
    private String reason;

}