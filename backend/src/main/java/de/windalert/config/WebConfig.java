package de.windalert.config;

import de.windalert.controller.UIInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {


    private final UI ui;

    @Autowired
    WebConfig(final UI ui) {
        this.ui = ui;
    }

    /**
     * Configures Spring MVC to deliver the build result of the ui module via HTTP.
     */
    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        final String uiResourceLocation = ui.getRootURI().toString();
        log.info("Serving ui from {}", uiResourceLocation);
        registry.addResourceHandler("/**").addResourceLocations(uiResourceLocation);
    }

    @Override
    public void addInterceptors(@NonNull final InterceptorRegistry registry) {
        final String uiResourceLocation = ui.getRootURI().toString();
        final List<String> paths = new LinkedList<>();

        try {
            final File file = new File(new URI(uiResourceLocation));
            final File[] files = file.listFiles();
            Arrays
                    .stream(files != null ? files : new File[]{})
                    .filter(File::isDirectory)
                    .map(File::getName)
                    .map("/"::concat)
                    .forEach(paths::add);
        } catch (final URISyntaxException e) {
            log.error("Cannot list files in UI path {}", uiResourceLocation, e);
        }

        registry.addInterceptor(new UIInterceptor(paths));
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(
                        "/static/**",
                        "/favicon.ico",
                        "/index.html",
                        "/*.js",
                        "/*.css"
                );
    }

}
