package de.windalert.service;


import de.windalert.domain.Spot;
import de.windalert.domain.WindWindow;
import de.windalert.repository.SpotRepository;
import de.windalert.repository.WindWindowRepository;
import de.windalert.service.dto.ApiResponse;
import de.windalert.util.MailService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestClient;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@TestPropertySource(properties = {
        "app.ui=../frontend",
        "BASE_URL=http://test"
})
@ActiveProfiles("test")
public class AskApiTest {

    private final AskAPI askAPI;

    @Mock
    private MailService mailService;

    @PersistenceContext
    protected EntityManager entityManager;

    @Mock
    private final RestService restService;
    private final SpotRepository spotRepository;
    private final WindWindowRepository windWindowRepository;

    @BeforeAll
    static void start() {
        DockerPostgresqlServer.start();
    }

    @DynamicPropertySource
    public static void fillProperties(final DynamicPropertyRegistry registry) {
        DockerPostgresqlServer.fillDbProperties(registry);
    }

    @Autowired
    public AskApiTest(AskAPI askAPI, RestService restService, SpotRepository spotRepository, WindWindowRepository windWindowRepository) {
        this.askAPI = askAPI;
        this.restService = restService;
        this.spotRepository = spotRepository;
        this.windWindowRepository = windWindowRepository;
    }



    @Test
    void testIsValidTime() {
        LocalDateTime date = LocalDateTime.of(2024, 10, 10, 13, 0);
        assertEquals("10.10.2024 um 13:00 Uhr", askAPI.dateToString(date));
    }
}
