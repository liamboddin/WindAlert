package de.windalert.service;

import de.windalert.domain.Spot;
import de.windalert.domain.WindWindow;
import de.windalert.repository.SpotRepository;
import de.windalert.service.dto.ApiResponse;
import de.windalert.util.MailService;
import de.windalert.util.SpotStringified;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AskAPI {

    private final static String defaultUriVars = "&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn";
    private final SpotRepository spotRepository;
    private final RestService restService;
    private final MailService mailService;

    public AskAPI(MailService mailService, SpotRepository spotRepository, RestService restService) {
        this.mailService = mailService;
        this.spotRepository = spotRepository;
        this.restService = restService;
    }

    @Scheduled(cron = "0 0 7 * * *", zone = "Europe/Berlin")
    public void requestAPIAndSendMail() {
        List<Spot> spots = spotRepository.findAll();
        log.info("Starting to look for some wind!");
        boolean isWindFound = false;
        List<SpotStringified> spotStringifiedList = new ArrayList<>();
        for (Spot spot : spots) {
            ApiResponse r = restService.requestApi("?latitude=" + spot.getLatitude() + "&longitude=" +
                    spot.getLongitude() + defaultUriVars);
            Float minSpeed = null;
            List<LocalDateTime> startingHour = new ArrayList<>();
            List<LocalDateTime> endingHour = new ArrayList<>();
            boolean isStringWritten = false;
            boolean isHourRangeStarted = false;
            List<String> windDates = new ArrayList<>();
            if (!isResponseValid(r)) {
                log.error("Response was not valid!");
                continue;
            }
            ApiResponse.Hourly hourly = r.hourly();
            for (int i = 0; i < hourly.time().size(); i++) {

                LocalDateTime date = LocalDateTime.parse(hourly.time().get(i));
                if (isMorning(date) || (isEvening(date) && isStringWritten)) {
                    // Skip the nights
                    if (isMorning(date)) {
                        // Reset everything for the next day
                        startingHour = new ArrayList<>();
                        endingHour = new ArrayList<>();
                        isStringWritten = false;
                        isHourRangeStarted = false;
                        minSpeed = null;
                    }
                    continue;
                }
                if (isEvening(date) && !isStringWritten) {
                    if (!startingHour.isEmpty()) {
                        if (endingHour.size() < startingHour.size()) {
                            endingHour.add(date.minusHours(1));
                        }
                        StringBuilder windDateText = new StringBuilder();
                        // If the logic is correct, those should be of the same size
                        assert startingHour.size() == endingHour.size();
                        windDateText.append(dateToString(startingHour.getFirst()));
                        boolean isFirstRange = true;
                        for (int j = 0; j < startingHour.size(); j++) {
                            if (!isFirstRange) {
                                windDateText.append(" und");
                            }
                            windDateText.append(hourRangeToString(startingHour.get(j), endingHour.get(j)));
                            isFirstRange = false;
                        }
                        windDateText.append(" Wind mit mindestens ").append(minSpeed).append(" Knoten");
                        windDates.add(windDateText.toString());
                    }
                    isStringWritten = true;
                    continue;
                }

                int finalI = i;
                if (!spot.getWindWindows().stream()
                        .filter(w -> isGoodWind(w, hourly.wind_speed_10m().get(finalI), hourly.wind_direction_10m().get(finalI)))
                        .toList().isEmpty()) {
                    // Good wind in some wind window
                    isWindFound = true;
                    if (!isHourRangeStarted) {
                        startingHour.add(date);
                        isHourRangeStarted = true;
                    }
                    minSpeed = minSpeed != null ?
                            Float.min(minSpeed, hourly.wind_speed_10m().get(i)) :
                            hourly.wind_speed_10m().get(i);
                }
                if (spot.getWindWindows().stream()
                        .filter(w -> isGoodWind(w, hourly.wind_speed_10m().get(finalI), hourly.wind_direction_10m().get(finalI)))
                        .toList().isEmpty()
                        && isHourRangeStarted) {
                    // No wind in any wind window
                    endingHour.add(date.minusHours(1));
                    isHourRangeStarted = false;
                }
            }
            if (!windDates.isEmpty()) {
                spotStringifiedList.add(new SpotStringified(spot.getName(), windDates));
            }
        }
        if (isWindFound) {
            log.info("Sending mail!");
            mailService.sendMail("liam.d.boddin@gmail.com", "WindAlert", spotStringifiedList);
        }
        log.info("Finished looking for wind!");
    }

    public boolean isMorning(LocalDateTime date) {
        return date.getHour() < 8;
    }

    public boolean isGoodWind(WindWindow windWindow, Float windSpeed, Integer windDirection) {
        return windSpeed >= windWindow.getSpeed()
                && isWithinWindRange(windWindow, windDirection);
    }

    public boolean isEvening(LocalDateTime date) {
        return date.getHour() > 20;
    }

    private boolean isResponseValid(ApiResponse r) {
        if (r == null || r.hourly() == null) {
            log.error("Response is null");
            return false;
        }
        ApiResponse.Hourly hourly = r.hourly();
        if (hourly.wind_direction_10m().size() != hourly.wind_gusts_10m().size()
                || hourly.wind_gusts_10m().size() != hourly.wind_speed_10m().size()
                || hourly.wind_speed_10m().size() != hourly.temperature_2m().size()
                || hourly.temperature_2m().size() != hourly.time().size()) {
            log.error("Mismatching sizes of response hourly entities");
            return false;
        }
        return true;
    }

    private boolean isWithinWindRange(WindWindow windWindow, Integer angle) {
        if (windWindow.getStartAngle() > windWindow.getEndAngle()) {
            return angle >= windWindow.getStartAngle() || angle <= windWindow.getEndAngle();
        }
        return angle >= windWindow.getStartAngle() && angle <= windWindow.getEndAngle();
    }

    public String dateToString(LocalDateTime date) {
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    }

    public String hourRangeToString(LocalDateTime startingDate, LocalDateTime endingDate) {
        return startingDate.getHour() != endingDate.getHour() ?
                startingDate.format(DateTimeFormatter.ofPattern("' von 'HH:mm'-'"))
                        + endingDate.format(DateTimeFormatter.ofPattern("HH:mm' Uhr'")) :
                startingDate.format(DateTimeFormatter.ofPattern("' um 'HH:mm' Uhr'"));
    }
}
