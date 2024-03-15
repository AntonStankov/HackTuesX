package com.example.micro;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/media")
public class TestController {
    @GetMapping("/test")
    public String text(){
        return "Hello Giga!";
    }

    @GetMapping("/user")
    public Object user(HttpServletRequest request){
        String token = null;
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7); // Extract token without "Bearer "
        }
        String uri = "http://138.197.104.32:8765/api/user";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer " + token);
        headers.add("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>("body", headers);
        ResponseEntity<String> result = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
        System.out.println(result);
        return result;
    }
}
