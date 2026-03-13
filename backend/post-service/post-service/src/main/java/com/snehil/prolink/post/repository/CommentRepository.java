package com.snehil.prolink.post.repository;

import com.snehil.prolink.post.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtAsc(Long postId);

    List<Comment> findByPostIdAndParentIdOrderByCreatedAtAsc(Long postId, Long parentId);

    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);

    long countByPostId(Long postId);
}
