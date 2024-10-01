package de.windalert.service;

import de.windalert.domain.Spot;
import de.windalert.domain.WindWindow;
import de.windalert.dto.CreateSpotDTO;
import de.windalert.dto.InfoDTO;
import de.windalert.dto.SpotDTO;
import de.windalert.dto.WindWindowDTO;
import de.windalert.repository.SpotRepository;
import de.windalert.repository.WindWindowRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CrudService {

    private final WindWindowRepository windWindowRepository;
    private final SpotRepository spotRepository;

    public CrudService(WindWindowRepository windWindowRepository, SpotRepository spotRepository) {
        this.windWindowRepository = windWindowRepository;
        this.spotRepository = spotRepository;
    }


    public List<InfoDTO> getInfoList() {
        return spotRepository.findAll().stream()
                .map(spot -> new InfoDTO(spot.getId(), spot.getName(), spot.getLatitude(),
                        spot.getLongitude(),
                        spot.getWindWindows().stream().map((ww) -> new InfoDTO.WindWindow(ww.getId(),
                                ww.getSpeed(), ww.getStartAngle(), ww.getEndAngle())).toList())).toList();
    }

    public SpotDTO createSpot(CreateSpotDTO createSpotDTO) {
        Optional<Spot> optionalSpot = spotRepository.findByName(createSpotDTO.name());
        if (optionalSpot.isPresent()) {
            throw new IllegalArgumentException("Spot does already exist");
        }
        log.info("Creating new spot with name {}", createSpotDTO.name() );
        Spot spot = new Spot(createSpotDTO.name(),  new HashSet<>(),
                createSpotDTO.latitude(), createSpotDTO.longitude());
        spot = spotRepository.save(spot);
        return new SpotDTO(spot.getId(), spot.getName(),  spot.getLatitude(), spot.getLongitude());
    }

    public SpotDTO updateSpot(SpotDTO spotDTO) {
        Optional<Spot> optionalSpot = spotRepository.findById(spotDTO.id());
        if (optionalSpot.isEmpty()) {
            throw new IllegalArgumentException("Spot does not exist");
        }
        log.info("Updating spot with name {}.", optionalSpot.get().getName());
        Spot spot = optionalSpot.get();
        spot.setName(spotDTO.name());
        spot.setLatitude(spotDTO.latitude());
        spot.setLongitude(spotDTO.longitude());


        spot = spotRepository.save(spot);
        return new SpotDTO(spot.getId(), spot.getName(), spot.getLatitude(), spot.getLongitude());
    }

    public void deleteSpot(Long id) {
        log.info("Deleting spot with id {}", id);
        spotRepository.deleteById(id);
    }

    public WindWindowDTO createWindWindow(WindWindowDTO windWindowDTO) {
        Optional<Spot> optionalSpot = spotRepository.findById(windWindowDTO.spotId());
        if (optionalSpot.isEmpty()) {
            throw new IllegalArgumentException("Spot does not exist");
        }
        log.info("Creating new wind window for spot with id {}", windWindowDTO.spotId());
        Spot spot = optionalSpot.get();
        WindWindow windWindow = new WindWindow(windWindowDTO.speed(), windWindowDTO.startAngle(), windWindowDTO.endAngle());
        spot.getWindWindows().add(windWindow);
        windWindow = windWindowRepository.save(windWindow);
        return new WindWindowDTO(windWindow.getId(), windWindow.getSpeed(), windWindow.getStartAngle(),
                windWindow.getEndAngle(), spot.getId());

    }

    public WindWindowDTO updateWindWindow(WindWindowDTO windWindowDTO) {
        Optional<WindWindow> optionalWindWindow = windWindowRepository.findById(windWindowDTO.id());
        if (optionalWindWindow.isEmpty()) {
            throw new IllegalArgumentException("Wind window does not exist");
        }
        Optional<Spot> optionalSpot = spotRepository.findById(windWindowDTO.spotId());
        if (optionalSpot.isEmpty()) {
            throw new IllegalArgumentException("Spot does not exist");
        }
        log.info("Updating wind window with id {}.", windWindowDTO.id());
        Spot spot = optionalSpot.get();
        WindWindow windWindow = optionalWindWindow.get();
        windWindow.setSpeed(windWindowDTO.speed());
        windWindow.setStartAngle(windWindowDTO.startAngle());
        windWindow.setEndAngle(windWindowDTO.endAngle());
        windWindow = windWindowRepository.save(windWindow);
        return new WindWindowDTO(windWindow.getId(), windWindow.getSpeed(), windWindow.getStartAngle(),
                windWindow.getEndAngle(), spot.getId());
    }

    public void deleteWindWindow(Long id) {
        log.info("Deleting wind window with id {}", id);
        windWindowRepository.deleteById(id);
    }
}
