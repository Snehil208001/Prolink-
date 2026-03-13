package com.snehil.prolink.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentCreateRequestDto {

    @NotBlank(message = "Content is required")
    @Size(max = 2000)
    private String content;

    /** Optional. When set, this is a reply to the specified comment. */
    private Long parentId;
}
