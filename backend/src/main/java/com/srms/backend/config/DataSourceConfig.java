package com.srms.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${custom.datasource.mysql.url:jdbc:mysql://localhost:3306/srms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}")
    private String mysqlUrl;

    @Value("${custom.datasource.mysql.username:root}")
    private String mysqlUsername;

    @Value("${custom.datasource.mysql.password:}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (checkMysqlConnection()) {
            log.info("🚀 MySQL connection successful! Using MySQL database at {}", mysqlUrl);
            HikariDataSource dataSource = new HikariDataSource();
            dataSource.setJdbcUrl(mysqlUrl);
            dataSource.setUsername(mysqlUsername);
            dataSource.setPassword(mysqlPassword);
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            return dataSource;
        } else {
            log.warn("⚠️ MySQL connection failed or unavailable. Falling back to H2 In-Memory Database...");
            HikariDataSource dataSource = new HikariDataSource();
            dataSource.setJdbcUrl("jdbc:h2:mem:srmsdb;DB_CLOSE_DELAY=-1;MODE=MySQL");
            dataSource.setUsername("sa");
            dataSource.setPassword("password");
            dataSource.setDriverClassName("org.h2.Driver");
            return dataSource;
        }
    }

    private boolean checkMysqlConnection() {
        // Set a short timeout for the connection check
        DriverManager.setLoginTimeout(3); 
        try (Connection connection = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
            return true;
        } catch (SQLException e) {
            log.debug("MySQL check failed: {}", e.getMessage());
            return false;
        }
    }
}
