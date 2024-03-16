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
            String sql = "SELECT * FROM users WHERE email = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, email);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        User user = new User();
                        user.setId(resultSet.getLong("id"));
                        user.setEmail(resultSet.getString("email"));
                        user.setName(resultSet.getString("name"));
                        user.setUsername(resultSet.getString("username"));
                        user.setPassword(resultSet.getString("password"));

                        int followersCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE followed_id = ?", user.getId());
                        user.setFollowers(followersCount);

                        int followingCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE follower_id = ?", user.getId());
                        user.setFollowing(followingCount);

                        return user;
                    }
                }
            }
        } catch (SQLException e) {
        }

        return null;
    }

    public User findByUsername(String username) {
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT * FROM users WHERE username = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, username);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        User user = new User();
                        user.setId(resultSet.getLong("id"));
                        user.setEmail(resultSet.getString("email"));
                        user.setName(resultSet.getString("name"));
                        user.setUsername(resultSet.getString("username"));
                        user.setPassword(resultSet.getString("password"));

                        int followersCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE followed_id = ?", user.getId());
                        user.setFollowers(followersCount);

                        int followingCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE follower_id = ?", user.getId());
                        user.setFollowing(followingCount);

                        return user;
                    }
                }
            }
        } catch (SQLException e) {
        }

        return null;
    }

    private int getCount(Connection connection, String sql, Long userId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getInt(1);
                }
            }
        }
        return 0;
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
                        user.setUsername(resultSet.getString("username"));
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
        }

        return null;
    }


    public List<User> findByNameContaining(String username) {
        List<User> users = new ArrayList<>();
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT * FROM users WHERE username LIKE ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, "%" + username + "%");
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        User user = new User();
                        user.setId(resultSet.getLong("id"));
                        user.setEmail(resultSet.getString("email"));
                        user.setUsername(resultSet.getString("username"));
                        user.setName(resultSet.getString("name"));
                        user.setPassword(resultSet.getString("password"));

                        int followersCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE followed_id = ?", user.getId());
                        user.setFollowers(followersCount);

                        int followingCount = getCount(connection, "SELECT COUNT(*) FROM follow_row WHERE follower_id = ?", user.getId());
                        user.setFollowing(followingCount);

                        users.add(user);
                    }
                }
            }
        } catch (SQLException e) {
        }

        return users;
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
