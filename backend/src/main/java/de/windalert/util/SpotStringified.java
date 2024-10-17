package de.windalert.util;

import java.util.List;

public record SpotStringified(
        String spotName,
        List<String> windDates
) {
}
