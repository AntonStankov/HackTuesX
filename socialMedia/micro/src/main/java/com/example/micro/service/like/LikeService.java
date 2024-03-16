package com.example.micro.service.like;

import com.example.micro.entity.Like;
import org.springframework.stereotype.Service;

@Service
public interface LikeService {
    Like save(Like like);
}
