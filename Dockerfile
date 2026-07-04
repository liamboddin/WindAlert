# Stage 1: Build Frontend
FROM node:lts-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk21-alpine AS backend-build
WORKDIR /app/backend

# Copy gradle config first to cache dependencies
COPY backend/build.gradle .
COPY backend/settings.gradle .

# Using pre-installed gradle in the image instead of wrapper to avoid download issues in QEMU
RUN gradle dependencies --no-daemon

COPY backend/src src
RUN gradle bootJar --no-daemon

# Stage 3: Final Image
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S windalert && adduser -S windalert -G windalert
USER windalert

ENV JVM_OPTS="-Xms512m -Xmx512m"
WORKDIR /app

# Copy Backend JAR
COPY --from=backend-build /app/backend/build/libs/*.jar application.jar

# Copy Frontend dist
COPY --from=frontend-build /app/frontend/dist ./ui

ENTRYPOINT java -server $JVM_OPTS -jar application.jar --app.ui=./ui
