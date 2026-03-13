package com.snehil.prolink.connection_service.dto;

import com.snehil.prolink.connection_service.entity.ConnectionRequest;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConnectionRequestDto {

    private Long id;
    private Long senderId;
    private Long receiverId;
    private ConnectionRequest.ConnectionRequestStatus status;
    private LocalDateTime createdAt;
}
