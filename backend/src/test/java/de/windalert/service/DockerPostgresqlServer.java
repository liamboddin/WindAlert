package de.windalert.service;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.PostgreSQLContainer;

public class DockerPostgresqlServer {


        private static final String POSTGRESQL_DOCKER_IMAGE = "postgres:16";

        public static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(POSTGRESQL_DOCKER_IMAGE);

        public static void fillDbProperties(final DynamicPropertyRegistry registry) {

            final String jdbcUrl = POSTGRES.getJdbcUrl();
            final String userName = POSTGRES.getUsername();
            final String password = POSTGRES.getPassword();

            registry.add("spring.datasource.url", () -> jdbcUrl);
            registry.add("spring.datasource.username", () -> userName);
            registry.add("spring.datasource.password", () -> password);
        }

        public static void start() {
            POSTGRES.setCommand("postgres", "-c", "max_connections=3200", "-c", "fsync=off");
            POSTGRES.start();
        }

}
