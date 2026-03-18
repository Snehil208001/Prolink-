package com.snehil.prolink.user_service.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String headline;
    private String bio;
    private String location;
}
