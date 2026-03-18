package com.snehil.prolink.post.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.validation.constraints.Size;

@Data
public class RepostRequestDto {

    @NotNull(message = "Original post ID is required")
    private Long originalPostId;

    /** Optional quote text for quote reposts. Omit or empty for simple repost. */
    @Size(max = 2000)
    private String quoteText;
}
