package com.taogexuefen.aethernet_backend.model.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FavoriteVO {
    private Long favoriteId;

    private Long postId;

    private String postTitle;

    private String postAuthor;

    private String coverImage;

    private LocalDateTime createdAt;
}

