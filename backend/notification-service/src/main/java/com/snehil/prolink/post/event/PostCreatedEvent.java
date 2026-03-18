package com.snehil.prolink.post.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreatedEvent {
    Long creatorId;
    String content;
    Long postId;
}
