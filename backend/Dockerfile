FROM openjdk:21-jdk-slim as builder

WORKDIR /app
RUN apt-get update && apt-get install -y maven
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine as prod

ARG PROFILE
ENV PROFILE_ENV=$PROFILE

RUN mkdir /app
COPY --from=builder /app/target/*.jar /app/app.jar
WORKDIR /app
EXPOSE 8089



ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${PROFILE_ENV}", "app.jar"]
