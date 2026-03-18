package com.snehil.prolink.post.service;

import com.snehil.prolink.post.auth.UserContextHolder;
import com.snehil.prolink.post.clients.ConnectionClient;
import com.snehil.prolink.post.dto.PersonDto;
import com.snehil.prolink.post.dto.PostCreateRequestDto;
import com.snehil.prolink.post.dto.PostDto;
import com.snehil.prolink.post.dto.RepostRequestDto;
import com.snehil.prolink.post.entity.Post;
import com.snehil.prolink.post.event.PostCreatedEvent;
import com.snehil.prolink.post.exception.ResourceNotFoundException;
import com.snehil.prolink.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final ConnectionClient connectionClient;

    private final KafkaTemplate<Long, PostCreatedEvent> kafkaTemplate;

    public PostDto createPost(PostCreateRequestDto postDto, Long userId) {
        Post post = modelMapper.map(postDto, Post.class);
        post.setUserId(userId);
        post.setOriginalPostId(null);
        Post savedPost = postRepository.save(post);
        PostCreatedEvent postCreatedEvent = PostCreatedEvent.builder()
                .postId(savedPost.getId())
                .creatorId(userId)
                .content(savedPost.getContent())
                .build();
        kafkaTemplate.send("post-created-topic",postCreatedEvent);
        return modelMapper.map(savedPost, PostDto.class);
    }

    public PostDto createRepost(RepostRequestDto dto, Long userId) {
        Post original = postRepository.findById(dto.getOriginalPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Original post not found with id: " + dto.getOriginalPostId()));
        Post repost = new Post();
        repost.setUserId(userId);
        repost.setOriginalPostId(original.getId());
        repost.setContent(dto.getQuoteText() != null && !dto.getQuoteText().isBlank() ? dto.getQuoteText() : null);
        Post saved = postRepository.save(repost);
        return modelMapper.map(saved, PostDto.class);
    }

    public PostDto getPostById(Long postId) {
        log.debug("Retrieving post with ID: {}", postId);
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId != null) {
            try {
                connectionClient.getFirstConnection(userId);
                // TODO send Notification to all connections
            } catch (Exception e) {
                log.warn("Could not fetch connections for post view notification: {}", e.getMessage());
            }
        }
        Post post = postRepository.findById(postId).orElseThrow(() ->
                new ResourceNotFoundException("Post not found with id: " + postId));
        return modelMapper.map(post, PostDto.class);
    }

    public List<PostDto> getAllPostsOfUser(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        return posts.stream()
                .map((element) -> modelMapper.map(element, PostDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Returns posts from the current user and their first-degree connections, ordered by date (newest first).
     */
    public List<PostDto> getFeed(Long userId) {
        List<Long> feedUserIds = new java.util.ArrayList<>();
        feedUserIds.add(userId);
        try {
            List<PersonDto> connections = connectionClient.getFirstConnection(userId);
            connections.stream()
                    .map(PersonDto::getUserId)
                    .filter(java.util.Objects::nonNull)
                    .forEach(feedUserIds::add);
        } catch (Exception e) {
            log.warn("Could not fetch connections for feed, using own posts only: {}", e.getMessage());
        }
        List<Post> posts = postRepository.findByUserIdInOrderByCreatedAtDesc(feedUserIds);
        return posts.stream()
                .map(p -> modelMapper.map(p, PostDto.class))
                .collect(Collectors.toList());
    }
}
