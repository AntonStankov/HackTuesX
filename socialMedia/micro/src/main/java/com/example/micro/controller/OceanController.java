package com.example.micro.controller;

import com.example.micro.User;
import com.example.micro.UserService;
import com.example.micro.entity.Ocean;
import com.example.micro.service.oceans.OceanRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/media/ocean")
public class OceanController {

    @Autowired
    private UserService userService;

    @Autowired
    private OceanRepo oceanRepo;

    @GetMapping("/findFollowingOceans")
    public List<Ocean> findFollowingOceans(HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());

        return oceanRepo.findFollowingOceans(user.getId());
    }
}
