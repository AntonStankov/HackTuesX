package com.example.micro.service;

import com.example.micro.entity.FollowEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FollowService {

    FollowEntity save(FollowEntity followEntity);
    boolean checkFollowing(Long follower_id, Long followed_id);

    List<FollowEntity> findFollowing(Long my_id);
    List<FollowEntity> findFollowers(Long my_id);

    void removeFollowing(Long my_id, Long followedId);
}
