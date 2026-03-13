package com.snehil.prolink.post.service;

import com.snehil.prolink.post.dto.CommentCreateRequestDto;
import com.snehil.prolink.post.dto.CommentDto;
import com.snehil.prolink.post.entity.Comment;
import com.snehil.prolink.post.exception.BadRequestException;
import com.snehil.prolink.post.exception.ResourceNotFoundException;
import com.snehil.prolink.post.repository.CommentRepository;
import com.snehil.prolink.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;

    public CommentDto createComment(Long postId, CommentCreateRequestDto dto, Long userId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }
        if (dto.getParentId() != null) {
            Comment parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found with id: " + dto.getParentId()));
            if (!parent.getPostId().equals(postId)) {
                throw new BadRequestException("Parent comment does not belong to this post");
            }
        }
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(dto.getContent());
        comment.setParentId(dto.getParentId());
        Comment saved = commentRepository.save(comment);
        return toDto(saved);
    }

    public List<CommentDto> getCommentsForPost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }
        List<Comment> all = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return buildNestedTree(all);
    }

    public CommentDto getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        return toDto(comment);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (!comment.getUserId().equals(userId)) {
            throw new BadRequestException("Not authorized to delete this comment");
        }
        commentRepository.delete(comment);
    }

    public long getCommentCount(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    private List<CommentDto> buildNestedTree(List<Comment> comments) {
        Map<Long, CommentDto> dtoMap = comments.stream()
                .map(this::toDto)
                .collect(Collectors.toMap(CommentDto::getId, dto -> dto));
        List<CommentDto> roots = new java.util.ArrayList<>();
        for (Comment c : comments) {
            CommentDto dto = dtoMap.get(c.getId());
            if (c.getParentId() == null) {
                roots.add(dto);
            } else {
                CommentDto parent = dtoMap.get(c.getParentId());
                if (parent != null) {
                    parent.getReplies().add(dto);
                } else {
                    roots.add(dto);
                }
            }
        }
        return roots;
    }

    private CommentDto toDto(Comment c) {
        CommentDto dto = modelMapper.map(c, CommentDto.class);
        dto.setReplies(new java.util.ArrayList<>());
        return dto;
    }
}
