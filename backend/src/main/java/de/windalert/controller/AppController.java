package de.windalert.controller;

import de.windalert.config.UI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

@UIController
public class AppController {
    private static final Logger LOG = LoggerFactory.getLogger(AppController.class);

    private final Path ui;

    @Autowired
    public AppController(final UI ui) {
        this.ui = ui.getRootPath();
    }

    @RequestMapping("/")
    @ResponseBody
    public String getMainUIPath() throws IOException {
        final Path indexHtml = ui.resolve("index.html");
        String html = Files.readString(indexHtml, StandardCharsets.UTF_8);
        LOG.debug("html resolves to {}.", html);
        return html;
    }
}
