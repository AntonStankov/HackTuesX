package com.example.micro.controller;

import com.example.micro.User;
import com.example.micro.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/media")
public class TestController {

    @Autowired
    private UserService userService;
    @GetMapping("/test")
    public String text(){
        return "Hello Giga!";
    }

    @GetMapping("/user")
    public User user(HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());

        return userService.findByEmail(user.getEmail());
    }
}
