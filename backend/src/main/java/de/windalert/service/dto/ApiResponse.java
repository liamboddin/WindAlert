package de.windalert.service.dto;

import java.util.List;

public record ApiResponse(
        Float latitude,
        Float longitude,
        Float generationtime_ms,
        Integer utc_offset_seconds,
        String timezone,
        String timezone_abbreviation,
        String elevation,
        HourlyUnits hourly_units,
        Hourly hourly
) {
    public record HourlyUnits(
            String time,
            String temperature_2m,
            String wind_speed_10m,
            String wind_direction_10m,
            String wind_gusts_10m
    ) {
    }

    public record Hourly(
            List<String> time,
            List<Float> temperature_2m,
            List<Float> wind_speed_10m,
            List<Integer> wind_direction_10m,
            List<Integer> wind_gusts_10m
    ) {
    }
}
