import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [eslintPlugin(), react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
