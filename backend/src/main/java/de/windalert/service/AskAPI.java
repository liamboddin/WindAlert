package de.windalert.service;

import de.windalert.domain.Spot;
import de.windalert.domain.WindWindow;
import de.windalert.repository.SpotRepository;
import de.windalert.service.dto.ApiResponse;
import de.windalert.util.MailService;
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
        StringBuilder emailText = new StringBuilder("Guten Morgen!\n");
        boolean isWindFound = false;
        for (Spot spot : spots) {
            ApiResponse r = restService.requestApi("?latitude=" + spot.getLatitude() + "&longitude=" +
                    spot.getLongitude() + defaultUriVars);
            boolean isPreTextWritten = false;
            for (WindWindow windWindow : spot.getWindWindows()) {
                if (!isResponseValid(r)) {
                    log.error("Response was not valid!");
                    break;
                }
                ApiResponse.Hourly hourly = r.hourly();
                Float minSpeed = null;
                List<LocalDateTime> startingHour = new ArrayList<>();
                List<LocalDateTime> endingHour = new ArrayList<>();
                boolean isStringWritten = false;
                boolean isHourRangeStarted = false;
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
                            // If the logic is correct, those should be of the same size
                            assert startingHour.size() == endingHour.size();
                            if (!isPreTextWritten) {
                                isPreTextWritten = true;
                                emailText.append("\nEs gibt am Spot ").append(spot.getName()).append(" zu folgenden Zeiten Wind:");
                            }
                            emailText.append("\n- ").append(dateToString(startingHour.getFirst()));
                            boolean isFirstRange = true;
                            for (int j = 0; j < startingHour.size(); j++) {
                                if (!isFirstRange) {
                                    emailText.append(" und");
                                }
                                emailText.append(hourRangeToString(startingHour.get(j), endingHour.get(j)));
                                isFirstRange = false;
                            }
                            emailText.append(" Wind mit mindestens ").append(minSpeed).append(" Knoten");
                        }
                        isStringWritten = true;
                        continue;
                    }
                    if (isGoodWind(windWindow, hourly.wind_speed_10m().get(i), hourly.wind_direction_10m().get(i))) {
                        isWindFound = true;
                        if (!isHourRangeStarted) {
                            startingHour.add(date);
                            isHourRangeStarted = true;
                        }
                        minSpeed = minSpeed != null ?
                                Float.min(minSpeed, hourly.wind_speed_10m().get(i)) :
                                hourly.wind_speed_10m().get(i);
                    }
                    if (!isGoodWind(windWindow, hourly.wind_speed_10m().get(i), hourly.wind_direction_10m().get(i))
                            && isHourRangeStarted) {
                        endingHour.add(date.minusHours(1));
                        isHourRangeStarted = false;
                    }
                }
            }
        }
        if (isWindFound) {
            emailText.append("\n\nViel Spaß beim Kiten!");
            log.info("Sending mail!");
            mailService.sendMail("liam.d.boddin@gmail.com", "WindAlert", emailText.toString());
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
