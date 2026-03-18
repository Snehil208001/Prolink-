package com.snehil.prolink.notification_service.clients;

import com.snehil.prolink.notification_service.dto.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "connection-service", path = "/connections")
public interface ConnectionClient {

    @GetMapping("/core/{userId}/first-degree")
    List<PersonDto> getFirstConnection(@PathVariable("userId") Long userId);


}
