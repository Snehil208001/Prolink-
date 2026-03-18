package com.snehil.prolink.post.service;


import com.snehil.prolink.post.entity.Post;
import com.snehil.prolink.post.entity.PostLike;
import com.snehil.prolink.post.event.PostLikedEvent;
import com.snehil.prolink.post.exception.BadRequestException;
import com.snehil.prolink.post.exception.ResourceNotFoundException;
import com.snehil.prolink.post.repository.PostLikeRepository;
import com.snehil.prolink.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final KafkaTemplate<Long, PostLikedEvent> kafkaTemplate;

    public void likePost(Long postId,Long userId) {
        log.info("Attempting to like the post with id: {}",postId);

        Post post = postRepository.findById(postId).orElseThrow(
                () ->new ResourceNotFoundException("Post not found with id: "+postId));

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(userId,postId);
        if (alreadyLiked) throw new BadRequestException("Cannot like the same post again");

        PostLike postLike = new PostLike();
        postLike.setPostId(postId);
        postLike.setUserId(userId);
        postLikeRepository.save(postLike);
        log.info("Post with id: {} liked successfully",postId);

        PostLikedEvent postLikedEvent = PostLikedEvent.builder()
                .postId(postId)
                .creatorId(post.getUserId())
                .likedByUserId(userId)
                .build();

        kafkaTemplate.send("post-liked-topic", postId, postLikedEvent);
    }

    public void unlikePost(Long postId, Long userId) {
        log.info("Attempting to unlike the post with id: {}",postId);
        boolean exists = postRepository.existsById(postId);
        if (!exists) throw new ResourceNotFoundException("Post not found with id: "+postId);

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(userId,postId);
        if (!alreadyLiked) throw new BadRequestException("Cannot unlike the post which is not liked");

        postLikeRepository.deleteByUserIdAndPostId(userId,postId);

        log.info("Post with id: {} unliked successfully",postId);
    }
}
