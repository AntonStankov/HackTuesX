package com.example.micro;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service

public class UserService {
    private final DataSource dataSource;

    public UserService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public User findByEmail(String email) {
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT u FROM users u WHERE u.email = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, email);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        String userEmail = resultSet.getString("email");
                        String userName = resultSet.getString("name");
                        User user = new User();
                        user.setId(resultSet.getLong("id"));
                        user.setEmail(resultSet.getString("email"));
                        user.setName(resultSet.getString("name"));
                        user.setPassword(resultSet.getString("password"));
                        user.setEmail_verified_at(resultSet.getTimestamp("email_verified_at"));
                        user.setCreated_at(resultSet.getTimestamp("created_at"));
                        user.setRemember_token(resultSet.getString("remember_token"));
                        user.setUpdated_at(resultSet.getTimestamp("updated_at"));
                        return user;
                    }
                }
            }
        } catch (SQLException e) {
            // Handle exception
        }

        return null;
    }

    public User findById(Long id) {
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT * FROM users WHERE id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setLong(1, id);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        String userEmail = resultSet.getString("email");
                        String userName = resultSet.getString("name");
                        User user = new User();
                        user.setId(resultSet.getLong("id"));
                        user.setEmail(resultSet.getString("email"));
                        user.setName(resultSet.getString("name"));
                        user.setPassword(resultSet.getString("password"));
//                        user.setEmail_verified_at(resultSet.getTimestamp("email_verified_at"));
//                        user.setCreated_at(resultSet.getTimestamp("created_at"));
//                        user.setRemember_token(resultSet.getString("remember_token"));
//                        user.setUpdated_at(resultSet.getTimestamp("updated_at"));
                        return user;
                    }
                }
            }
        } catch (SQLException e) {
            // Handle exception
        }

        return null;
    }
}

//    private Long id;
//    private String name;
//    private String email;
//    private Timestamp email_verified_at;
//    private String password;
//    private String remember_token;
//    private Timestamp created_at;
//    private Timestamp updated_at;
