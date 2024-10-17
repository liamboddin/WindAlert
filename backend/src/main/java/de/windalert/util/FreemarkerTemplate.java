package de.windalert.util;

import java.util.Locale;

public enum FreemarkerTemplate {
    WIND_INFORMATION;

    public String getFreeMarkerTemplate(final Locale locale) {
        return this.name().toLowerCase().replace("_", "-") + "_" + locale.getLanguage() + ".ftlh";
    }
}
