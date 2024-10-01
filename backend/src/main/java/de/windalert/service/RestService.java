package de.windalert.service;

import de.windalert.service.dto.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;

@Service
@Transactional
public class RestService {
    private final static String apiUrl = "https://api.open-meteo.com/v1/forecast";
    private final RestClient restClient;

    public RestService() {
        this.restClient = RestClient.builder().baseUrl(apiUrl).build();
    }

    public ApiResponse requestApi(String uri) {
        return restClient.get().uri(uri).retrieve().body(ApiResponse.class);
    }
}
