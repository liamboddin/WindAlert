package de.windalert.dto;

import java.util.List;

public record InfoDTO(
        Long spotId,
        String spotName,
        Float spotLatitude,
        Float spotLongitude,
        List<WindWindow> windows
) {
    public record WindWindow(
            Long windWindowId,
            Integer speed,
            Integer startAngle,
            Integer endAngle
    ) {
    }
}
