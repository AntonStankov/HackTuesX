package com.example.micro;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private Timestamp email_verified_at;
    private String password;
    private String remember_token;
    private Timestamp created_at;
    private Timestamp updated_at;
}
