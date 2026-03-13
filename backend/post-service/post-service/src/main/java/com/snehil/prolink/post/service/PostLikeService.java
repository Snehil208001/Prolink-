package com.snehil.prolink.post.service;


import com.snehil.prolink.post.entity.PostLike;
import com.snehil.prolink.post.exception.BadRequestException;
import com.snehil.prolink.post.exception.ResourceNotFoundException;
import com.snehil.prolink.post.repository.PostLikeRepository;
import com.snehil.prolink.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    public void likePost(Long postId,Long userId) {
        log.info("Attempting to like the post with id: {}",postId);
        boolean exists = postRepository.existsById(postId);
        if (!exists) throw new ResourceNotFoundException("Post not found with id: "+postId);

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(userId,postId);
        if (alreadyLiked) throw new BadRequestException("Cannot like the same post again");

        PostLike postLike = new PostLike();
        postLike.setPostId(postId);
        postLike.setUserId(userId);
        postLikeRepository.save(postLike);
        log.info("Post with id: {} liked successfully",postId);
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
