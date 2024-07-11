FROM openjdk:21-jdk-slim as builder

WORKDIR /app
RUN apt-get update && apt-get install -y maven
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests

FROM eclipse-temurin:22.0.1_8-jdk-alpine as prod

ARG PROFILE
ENV PROFILE_ENV=$PROFILE

ENV JAVA_OPTS="-Xms512m -Xmx1g -XX:+UseG1GC"

RUN mkdir /app
COPY --from=builder /app/target/*.jar /app/app.jar
WORKDIR /app
EXPOSE 8089

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=${PROFILE_ENV} -jar app.jar"]
