package com.snehil.prolink.post.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class CommentDto {
    private Long id;
    private Long postId;
    private Long userId;
    private String content;
    private Long parentId;
    private LocalDateTime createdAt;
    private List<CommentDto> replies = new ArrayList<>();
}
