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
            String sql = "SELECT o.* FROM ocean o " +
                    "JOIN follow_row f ON o.user_id = f.followed_id " +
                    "WHERE f.follower_id = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setLong(1, userId);
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        Ocean ocean = new Ocean();
                        ocean.setOcean_id(resultSet.getLong("ocean_id"));
                        ocean.setUser_id(resultSet.getLong("user_id"));
                        ocean.setOcean_string("");
                        ocean.setName(resultSet.getString("name"));
                        oceans.add(ocean);
                    }
                }
            }
        } catch (SQLException e) {
            // Handle exception
        }

        return oceans;
    }
}
