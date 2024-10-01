package de.windalert.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;

@Slf4j
public class UIInterceptor implements HandlerInterceptor {
    private final List<String> excludePaths;

    public UIInterceptor(final List<String> excludePaths) {
        this.excludePaths = excludePaths;
    }

    @Override
    public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
        final String requestURI = request.getRequestURI();

        // If the uri starts with "/", "/api" or is equal to "/vite.svg", let the request pass to the appropriate handler
        if (requestURI.equals("/") || requestURI.startsWith("/api") || requestURI.equals("/vite.svg")) {

            return true;
        }

        // If the uri starts with a known directory from ui path, let the request pass to the resource handler
        if (excludePaths.stream().anyMatch(requestURI::startsWith)) {
            return true;
        }

        // In other cases, redirect to UI handler
        request.getRequestDispatcher("/").forward(request, response);
        return false;
    }
}
