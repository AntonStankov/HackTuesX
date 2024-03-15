package com.example.micro.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Ocean {
    private Long ocean_id;
    private Long user_id;
    private String ocean_string;
    private String name;
}
