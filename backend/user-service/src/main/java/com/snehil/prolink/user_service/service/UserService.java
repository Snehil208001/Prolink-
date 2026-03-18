package com.snehil.prolink.user_service.service;

import com.snehil.prolink.user_service.dto.ProfileUpdateDto;
import com.snehil.prolink.user_service.dto.UserDto;
import com.snehil.prolink.user_service.exception.ResourceNotFoundException;
import com.snehil.prolink.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserDto getProfile(Long userId) {
        return userRepository.findById(userId)
                .map(user -> modelMapper.map(user, UserDto.class))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersForDiscovery(Long excludeUserId) {
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(excludeUserId))
                .map(user -> modelMapper.map(user, UserDto.class))
                .collect(Collectors.toList());
    }

    public UserDto updateProfile(Long userId, ProfileUpdateDto dto) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getHeadline() != null) {
            user.setHeadline(dto.getHeadline().isBlank() ? null : dto.getHeadline().trim());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio().isBlank() ? null : dto.getBio().trim());
        }
        if (dto.getLocation() != null) {
            user.setLocation(dto.getLocation().isBlank() ? null : dto.getLocation().trim());
        }
        var saved = userRepository.save(user);
        return modelMapper.map(saved, UserDto.class);
    }
}
