package com.example.micro.service;

import com.example.micro.entity.FollowEntity;
import org.springframework.stereotype.Service;

@Service
public interface FollowService {

    FollowEntity save(FollowEntity followEntity);
    boolean checkFollowing(Long follower_id, Long followed_id);
}
