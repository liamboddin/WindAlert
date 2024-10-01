package de.windalert.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UI {
    private static final Logger LOG = LoggerFactory.getLogger(UI.class);

    private final Path ui;

    @Autowired
    UI(@Value("${app.ui:}") final String uiPath) {

        if (!StringUtils.hasText(uiPath)) {
            throw new IllegalStateException("app.ui must be set");
        }

        final Path ui = Paths.get(uiPath);
        if (!Files.isDirectory(ui) || !Files.isRegularFile(ui.resolve("index.html"))) {
            throw new IllegalStateException("app.ui (\"" + uiPath + "\", resolves to " + ui.toAbsolutePath().normalize() + ") must point to the root directory of the ui build results");
        }

        LOG.debug("UI resolves to {}.", ui);

        this.ui = ui;
    }

    public Path getRootPath() {
        return ui;
    }

    public URI getRootURI() {
        return ui.toAbsolutePath().normalize().toUri();
    }
}
