package com.snehil.prolink.notification_service.repository;


import com.snehil.prolink.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreateAtDesc(Long userId);

    long countByUserIdAndReadFalse(Long userId);
}
