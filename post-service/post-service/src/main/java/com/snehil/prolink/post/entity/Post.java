package com.snehil.prolink.post.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Main content. Null for simple reposts (when originalPostId is set). */
    @Column(length = 2000)
    private String content;

    @Column(nullable = false)
    private Long userId;

    /** When non-null, this post is a repost/share of the referenced post. Content may be null for simple repost. */
    @Column(name = "original_post_id")
    private Long originalPostId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
