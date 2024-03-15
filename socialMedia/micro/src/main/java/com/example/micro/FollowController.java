package com.example.micro;


import com.example.micro.entity.FollowEntity;
import com.example.micro.service.FollowService;
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
}
