package com.snehil.prolink.user_service.dto;

import lombok.Data;

@Data
public class ProfileUpdateDto {
    private String name;
    private String headline;
    private String bio;
    private String location;
}
