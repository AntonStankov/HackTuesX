package com.example.micro.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "follow_row")
public class FollowEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long follower_id;
    private Long followed_id;
}
