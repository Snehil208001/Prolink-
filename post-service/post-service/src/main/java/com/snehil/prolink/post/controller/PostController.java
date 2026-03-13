package com.snehil.prolink.post.controller;

import com.snehil.prolink.post.auth.UserContextHolder;
import com.snehil.prolink.post.dto.PostCreateRequestDto;
import com.snehil.prolink.post.dto.PostDto;
import com.snehil.prolink.post.dto.RepostRequestDto;
import com.snehil.prolink.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostCreateRequestDto postDto) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PostDto createdPost = postService.createPost(postDto, userId);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @PostMapping("/repost")
    public ResponseEntity<PostDto> createRepost(@Valid @RequestBody RepostRequestDto dto) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PostDto created = postService.createRepost(dto, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /** Simple repost without quote. Equivalent to POST /repost with body {"originalPostId": postId}. */
    @PostMapping("/repost/{postId}")
    public ResponseEntity<PostDto> createSimpleRepost(@PathVariable Long postId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        RepostRequestDto dto = new RepostRequestDto();
        dto.setOriginalPostId(postId);
        dto.setQuoteText(null);
        PostDto created = postService.createRepost(dto, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PostDto postDto = postService.getPostById(postId);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping("/users/{userId}/allPosts")
    public ResponseEntity<List<PostDto>> getAllPostsOfUser(@PathVariable Long userId) {
        List<PostDto> posts = postService.getAllPostsOfUser(userId);
        return ResponseEntity.ok(posts);
    }

    /**
     * Feed: posts from current user and their first-degree connections, ordered by date (newest first).
     */
    @GetMapping("/feed")
    public ResponseEntity<List<PostDto>> getFeed() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<PostDto> feed = postService.getFeed(userId);
        return ResponseEntity.ok(feed);
    }
}
