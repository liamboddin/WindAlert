package de.windalert.controller;

import de.windalert.dto.*;
import de.windalert.service.AskAPI;
import de.windalert.service.CrudService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class WebController {

    private final CrudService crudService;
    private final AskAPI askAPI;

    @Autowired
    public WebController(CrudService crudService, AskAPI askAPI) {
        this.crudService = crudService;
        this.askAPI = askAPI;
    }

    @GetMapping("/spot")
    public List<InfoDTO> getSpots() {
        return crudService.getInfoList();
    }

    @PostMapping("/spot")
    public SpotDTO createSpot(@RequestBody @Valid CreateSpotDTO createSpotDTO) {
        return crudService.createSpot(createSpotDTO);
    }

    @PutMapping("/spot")
    public SpotDTO updateSpot(@RequestBody @Valid SpotDTO spotDTO) {
        return crudService.updateSpot(spotDTO);

    }

    @DeleteMapping("/spot/{id}")
    public void deleteSpot(@PathVariable Long id) {
        crudService.deleteSpot(id);
    }

    @PostMapping("/window")
    public WindWindowDTO createWindWindow(@RequestBody @Valid WindWindowDTO windWindowDTO) {
        return crudService.createWindWindow(windWindowDTO);
    }

    @PutMapping("/window")
    public WindWindowDTO updateWindWindow(@RequestBody WindWindowDTO windWindowDTO) {
        return crudService.updateWindWindow(windWindowDTO);
    }

    @DeleteMapping("/window/{id}")
    public void deleteWindWindow(@PathVariable Long id) {
        crudService.deleteWindWindow(id);
    }

    @PostMapping("/check-wind")
    public void sendMail() {
        askAPI.requestAPIAndSendMail();
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody @Valid PasswordReset passwordReset) {
        return;
    }

    @PostMapping("/login")
    public void login(@RequestBody @Valid Login login) {
        return;
    }
}
