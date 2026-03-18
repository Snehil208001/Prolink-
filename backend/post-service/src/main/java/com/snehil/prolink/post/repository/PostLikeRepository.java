package com.snehil.prolink.post.repository;

import com.snehil.prolink.post.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface PostLikeRepository extends JpaRepository<PostLike,Long>{
    boolean existsByUserIdAndPostId(Long userId,Long postId);

    @Transactional
    void deleteByUserIdAndPostId(Long userId,Long postId);
}
