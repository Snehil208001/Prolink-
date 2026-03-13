package com.snehil.prolink.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCreateRequestDto {
    @NotBlank(message = "Content is required")
    private String content;
}
