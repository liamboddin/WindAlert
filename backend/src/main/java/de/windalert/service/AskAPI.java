package de.windalert.service;

import de.windalert.domain.Spot;
import de.windalert.domain.WindWindow;
import de.windalert.repository.SpotRepository;
import de.windalert.service.dto.ApiResponse;
import de.windalert.util.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class AskAPI {

    private final static String apiUrl = "https://api.open-meteo.com/v1/forecast";
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
        for (Spot spot : spots) {
            boolean emailSent = false;
            ApiResponse r = restService.requestApi("?latitude=" + spot.getLatitude() + "&longitude=" +
                    spot.getLongitude() + defaultUriVars);
            for (WindWindow windWindow : spot.getWindWindows()) {
                if (!isResponseValid(r)) {
                    break;
                }
                ApiResponse.Hourly hourly = r.hourly();
                for (int i = 0; i < hourly.time().size(); i++) {
                    LocalDateTime date = LocalDateTime.parse(hourly.time().get(i));
                    if (!isValidTime(date)) {
                        continue;
                    }
                    if (hourly.wind_speed_10m().get(i) >= windWindow.getSpeed()
                            && isWithinWindRange(windWindow, hourly.wind_direction_10m().get(i))
                            && !emailSent) {
                        log.info("Sending mail");
                        mailService.sendMail("liam.d.boddin@gmail.com", "Wind Alert",
                                "Es gibt am Spot " + spot.getName() + " am " + dateToString(date) +
                                        " Wind mit dem Winkel " + hourly.wind_direction_10m().get(i) + " und der" +
                                        " Geschwindigkeit " + hourly.wind_speed_10m().get(i) + " Knoten.");
                        log.info("Mail sent!");
                        emailSent = true;
                    }
                }
            }
        }
        log.info("Finished looking for wind!");
    }

    public boolean isValidTime(LocalDateTime date) {
        if (date.getHour() < 8
                || date.getHour() > 21) {
            return false;
        }
        return true;
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
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy' um 'HH:mm' Uhr'"));
    }
}
