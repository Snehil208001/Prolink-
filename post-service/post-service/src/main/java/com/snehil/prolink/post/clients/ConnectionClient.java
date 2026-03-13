package com.snehil.prolink.post.clients;

import com.snehil.prolink.post.dto.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "connection-service", path = "/connections")
public interface ConnectionClient {

    @GetMapping("/core/{userId}/first-degree")
    List<PersonDto> getFirstConnection(@PathVariable Long userId);

}
