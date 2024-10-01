FROM eclipse-temurin:21-jre AS builder

ARG JAR_FILE=backend/build/libs/*-SNAPSHOT.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:21-jre

RUN groupadd windalert && useradd --no-log-init --system -g windalert windalert
USER windalert

ENV JVM_OPTS="-Xms1024m -Xmx1024m"

VOLUME /tmp

WORKDIR /app

COPY --from=builder dependencies/ ./

COPY --from=builder spring-boot-loader/ ./
COPY --from=builder application/ ./

COPY frontend/dist ./ui

ENTRYPOINT java -server $JVM_OPTS org.springframework.boot.loader.launch.JarLauncher --app.ui=./ui
