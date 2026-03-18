package com.snehil.prolink.post.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostDto {
    private Long id;
    private String content;
    private Long userId;
    private Long originalPostId;
    private LocalDateTime createdAt;
}
