package com.snehil.prolink.connection_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequestRejectedEvent {
    private Long requestId;
    private Long senderId;
    private Long receiverId;
}
