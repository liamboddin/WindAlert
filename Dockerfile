# Stage 1: Build Frontend
FROM node:lts-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle .
COPY backend/settings.gradle .
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon
COPY backend/src src
RUN ./gradlew bootJar --no-daemon

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
