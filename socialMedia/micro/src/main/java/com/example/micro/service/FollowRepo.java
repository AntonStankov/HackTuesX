package com.example.micro.service;

import com.example.micro.entity.FollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepo extends JpaRepository<FollowEntity, Long> {

    @Query("SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM FollowEntity WHERE follower_id = :follower_id AND followed_id = :followed_id")
    boolean checkFollowing(Long follower_id, Long followed_id);
}
