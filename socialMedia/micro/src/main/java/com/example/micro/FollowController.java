package com.example.micro;


import com.example.micro.entity.FollowEntity;
import com.example.micro.service.FollowService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/media/user/")
public class FollowController {

    @Autowired
    private UserService userService;

    @Autowired
    private FollowService followService;

    @PostMapping("/follow/{followed_id}")
    public FollowEntity follow(@PathVariable Long followed_id, HttpServletRequest request){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());
        if (followService.checkFollowing(user.getId(), followed_id)){
            throw new RuntimeException("");
        }
        else{
            FollowEntity followEntity = new FollowEntity();
            followEntity.setFollowed_id(followed_id);
            followEntity.setFollower_id(user.getId());
            return followService.save(followEntity);
        }
    }

    @GetMapping("/following")
    public List<User> following(HttpServletRequest httpServletRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());

        List<FollowEntity> following = followService.findFollowing(user.getId());
        List<User> users = new ArrayList<>();
        User test = new User();
        for (int i = 0; i < following.size(); i++){
            test = userService.findById(following.get(i).getFollowed_id());
            users.add(test);
        }
        return users;
    }

    @GetMapping("/followers")
    public List<User> followers(HttpServletRequest httpServletRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());

        List<FollowEntity> following = followService.findFollowers(user.getId());
        List<User> users = new ArrayList<>();
        User test = new User();
        for (int i = 0; i < following.size(); i++){
            test = userService.findById(following.get(i).getFollowed_id());
            users.add(test);
        }
        return users;
    }

    @DeleteMapping("/remove_following/{followed_id}")
    public boolean removeFollowing(@PathVariable Long followed_id, HttpServletRequest httpServletRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(principal.getUsername());


         followService.removeFollowing(user.getId(), followed_id);
         return true;
    }
}
