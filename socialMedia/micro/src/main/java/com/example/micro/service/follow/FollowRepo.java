package com.example.micro.service.follow;

import com.example.micro.entity.FollowEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Transactional
@Repository
public interface FollowRepo extends JpaRepository<FollowEntity, Long> {

    @Query("SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM FollowEntity WHERE follower_id = :follower_id AND followed_id = :followed_id")
    boolean checkFollowing(Long follower_id, Long followed_id);

    @Query("SELECT f FROM FollowEntity f WHERE f.follower_id = :my_id")
    List<FollowEntity> findFollowing(Long my_id);

    @Query("SELECT f FROM FollowEntity f WHERE f.followed_id = :my_id")
    List<FollowEntity> findFollowers(Long my_id);

    @Modifying
    @Query("DELETE FROM FollowEntity f WHERE f.follower_id = :my_id AND f.followed_id = :followedId")
    void removeFollowing(Long my_id, Long followedId);


}
