package com.snehil.prolink.user_service.service;

import com.snehil.prolink.user_service.dto.LoginRequestDto;
import com.snehil.prolink.user_service.dto.SignupRequestDto;
import com.snehil.prolink.user_service.dto.UserDto;
import com.snehil.prolink.user_service.entity.User;
import com.snehil.prolink.user_service.exception.BadRequestException;
import com.snehil.prolink.user_service.exception.ResourceNotFoundException;
import com.snehil.prolink.user_service.repository.UserRepository;
import com.snehil.prolink.user_service.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;

    public UserDto signUp(SignupRequestDto signupRequestDto) {
        if (userRepository.findByEmail(signupRequestDto.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }
        User user = modelMapper.map(signupRequestDto,User.class);
        user.setPassword(PasswordUtil.hashPassword(signupRequestDto.getPassword()));

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser,UserDto.class);

    }

    public String login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmail(loginRequestDto.getEmail()).orElseThrow(()->
                new ResourceNotFoundException("User not Found with email: "+loginRequestDto.getEmail()));

        boolean isPasswordMatch = PasswordUtil.checkPassword(loginRequestDto.getPassword(),user.getPassword());

        if (!isPasswordMatch) {
            throw new BadRequestException("Incorrect password");
        }

        return jwtService.generateAccessToken(user);

    }
}
