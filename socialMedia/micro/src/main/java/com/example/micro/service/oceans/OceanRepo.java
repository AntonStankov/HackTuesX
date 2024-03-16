package com.example.micro.service.oceans;

import com.example.micro.User;
import com.example.micro.entity.Ocean;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class OceanRepo {

    private final DataSource dataSource;

    public OceanRepo(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Ocean> findFollowingOceans(Long userId) {
        List<Ocean> oceans = new ArrayList<>();
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT o.*, COUNT(l.id) AS like_count, " +
                    "CASE WHEN EXISTS (SELECT 1 FROM likes l " +
                    "WHERE l.ocean_id = o.ocean_id AND l.user_id = ?) " +
                    "THEN true ELSE false END AS liked_by_user " +
                    "FROM ocean o " +
                    "JOIN follow_row f ON o.user_id = f.followed_id " +
                    "LEFT JOIN likes l ON o.ocean_id = l.ocean_id " +
                    "WHERE f.follower_id = ? " +
                    "GROUP BY o.ocean_id";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setLong(1, userId);
                statement.setLong(2, userId);
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        Ocean ocean = new Ocean();
                        ocean.setOcean_id(resultSet.getLong("ocean_id"));
                        ocean.setUser_id(resultSet.getLong("user_id"));
                        ocean.setOcean_string("");
                        ocean.setName(resultSet.getString("name"));
                        ocean.setLikes(resultSet.getInt("like_count"));
                        ocean.set_liked(resultSet.getBoolean("liked_by_user"));
                        oceans.add(ocean);
                    }
                }
            }
        } catch (SQLException e) {
        }

        return oceans;
    }

    public List<Ocean> trendingOceans(Long userId) {
        List<Ocean> oceans = new ArrayList<>();
        try (Connection connection = dataSource.getConnection()) {
            String sql = "SELECT o.*, COUNT(l.id) AS like_count, " +
                    "CASE WHEN EXISTS (SELECT 1 FROM likes l " +
                    "WHERE l.ocean_id = o.ocean_id AND l.user_id = ?) " +
                    "THEN true ELSE false END AS liked_by_user " +
                    "FROM ocean o " +
                    "JOIN follow_row f ON o.user_id = f.followed_id " +
                    "LEFT JOIN likes l ON o.ocean_id = l.ocean_id " +
                    "WHERE f.follower_id = ? " +
                    "GROUP BY o.ocean_id";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setLong(1, userId);
                statement.setLong(2, userId);
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        Ocean ocean = new Ocean();
                        ocean.setOcean_id(resultSet.getLong("ocean_id"));
                        ocean.setUser_id(resultSet.getLong("user_id"));
                        ocean.setOcean_string("");
                        ocean.setName(resultSet.getString("name"));
                        ocean.setLikes(resultSet.getInt("like_count"));
                        ocean.set_liked(resultSet.getBoolean("liked_by_user"));
                        oceans.add(ocean);
                    }
                }
            }
        } catch (SQLException e) {
        }

        return oceans;
    }


}
