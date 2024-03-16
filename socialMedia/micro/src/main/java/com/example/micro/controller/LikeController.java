package com.example.micro.controller;


import com.example.micro.User;
import com.example.micro.UserService;
import com.example.micro.entity.Like;
import com.example.micro.service.like.LikeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/like")
public class LikeController {

    @Autowired
    private UserService userService;

    @Autowired
    private LikeService likeService;
    @PostMapping("/ocean/{ocean_id}")
    public Like like(@PathVariable Long ocean_id, HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());

        Like like = new Like();
        like.setUser_id(user.getId());
        like.setOcean_id(ocean_id);
        return likeService.save(like);
    }
}
