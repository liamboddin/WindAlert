package de.windalert.controller;

import de.windalert.domain.User;
import de.windalert.dto.*;
import de.windalert.repository.UserRepository;
import de.windalert.service.AskAPI;
import de.windalert.service.CrudService;
import de.windalert.service.JwtService;
import de.windalert.util.MailService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
public class WebController {
    private final AuthenticationManager authenticationManager;
    private final CrudService crudService;
    private final JwtService jwtService;
    private final AskAPI askAPI;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MailService mailService;

    @Autowired
    public WebController(AuthenticationManager authenticationManager,
                         CrudService crudService,
                         JwtService jwtService,
                         AskAPI askAPI,
                         PasswordEncoder passwordEncoder,
                         UserRepository userRepository,
                         MailService mailService) {
        this.authenticationManager = authenticationManager;
        this.crudService = crudService;
        this.jwtService = jwtService;
        this.askAPI = askAPI;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO loginRequest) {
        try {
            // Authentication
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    )
            );

            log.info("User {} logged in", loginRequest.username());
            String token = jwtService.generateToken(loginRequest.username());
            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            log.error("Login failed for user {}", loginRequest.username(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/password-reset")
    public ResponseEntity<String> passwordReset(@RequestBody @Valid RegisterRequestDTO request) {
        Optional<User> userOpt = userRepository.findByUsername(request.username());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User doesn't exist");
        }
        User user = userOpt.get();
        user.setEnabled(false);
        user.setActivationToken(UUID.randomUUID().toString());

        userRepository.save(user);
        log.info("Password reset for user {}", user.getUsername());

        String activationLink = request.baseUrl() + "/reactivate?token=" + user.getActivationToken();
        mailService.sendMail(
                user.getUsername(),
                "Neues Passwort setzen",
                "Bitte klicke auf den Link, um dein Passwort zu setzen: " + activationLink
        );
        log.info("Password reset mail sent for user {}", user.getUsername());

        return ResponseEntity.ok("Password reset mail sent");
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequestDTO request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEnabled(false);
        user.setActivationToken(UUID.randomUUID().toString());

        userRepository.save(user);
        log.info("Registration for user {}", user.getUsername());

        String activationLink = request.baseUrl() + "/activate?token=" + user.getActivationToken();
        mailService.sendMail(
                user.getUsername(),
                "Registrierung bestätigen",
                "Bitte klicke auf den Link, um dein Passwort zu setzen: " + activationLink
        );
        log.info("Registration mail sent for user {}", user.getUsername());

        return ResponseEntity.ok("Registration mail sent");
    }

    @PostMapping("/activate")
    public ResponseEntity<String> activate(@RequestBody ActivateRequestDTO request) {
        Optional<User> userOpt = userRepository.findByActivationToken(request.token());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEnabled(true);
        user.setActivationToken(null);

        userRepository.save(user);
        log.info("User {} activated", user.getUsername());

        return ResponseEntity.ok("User activated successfully");
    }

    @GetMapping("/spot")
    public List<InfoDTO> getSpots(@AuthenticationPrincipal User user) {
        return crudService.getInfoList(user);
    }

    @PostMapping("/spot")
    public SpotDTO createSpot(@RequestBody @Valid CreateSpotDTO createSpotDTO, @AuthenticationPrincipal User user) {
        log.info("User {} created spot {}", user.getUsername(), createSpotDTO);
        return crudService.createSpot(createSpotDTO, user);
    }

    @PutMapping("/spot")
    public SpotDTO updateSpot(@RequestBody @Valid SpotDTO spotDTO, @AuthenticationPrincipal User user) {
        return crudService.updateSpot(spotDTO, user);
    }

    @DeleteMapping("/spot/{id}")
    public void deleteSpot(@PathVariable Long id, @AuthenticationPrincipal User user) {
        crudService.deleteSpot(id, user);
    }

    @PostMapping("/window")
    public WindWindowDTO createWindWindow(@RequestBody @Valid WindWindowDTO windWindowDTO, @AuthenticationPrincipal User user) {
        return crudService.createWindWindow(windWindowDTO, user);
    }

    @PutMapping("/window")
    public WindWindowDTO updateWindWindow(@RequestBody WindWindowDTO windWindowDTO, @AuthenticationPrincipal User user) {
        return crudService.updateWindWindow(windWindowDTO, user);
    }

    @DeleteMapping("/window/{id}")
    public void deleteWindWindow(@PathVariable Long id, @AuthenticationPrincipal User user) {
        crudService.deleteWindWindow(id, user);
    }

    @PostMapping("/check-wind")
    public void sendMail(@AuthenticationPrincipal User user) {
        askAPI.requestAPIAndSendMail(user);
    }
}
