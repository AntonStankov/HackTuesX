package com.example.micro.service;

import com.example.micro.entity.FollowEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService{

    @Autowired
    private FollowRepo followRepo;
    @Override
    public FollowEntity save(FollowEntity followEntity) {
        return followRepo.save(followEntity);
    }

    @Override
    public boolean checkFollowing(Long follower_id, Long followed_id) {
        return followRepo.checkFollowing(follower_id, followed_id);
    }

    @Override
    public List<FollowEntity> findFollowing(Long my_id) {
        return followRepo.findFollowing(my_id);
    }

    @Override
    public List<FollowEntity> findFollowers(Long my_id) {
        return followRepo.findFollowers(my_id);
    }

    @Override
    public void removeFollowing(Long my_id, Long followedId) {
        followRepo.removeFollowing(my_id, followedId);
    }
}
