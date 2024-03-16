package com.example.micro.service.like;


import com.example.micro.entity.Like;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService{

    @Autowired
    private LikeRepo likeRepo;
    @Override
    public Like save(Like like) {
        return likeRepo.save(like);
    }
}
