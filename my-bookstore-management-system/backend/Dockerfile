# build stage
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests


# runtime stage
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=build /app/target/my-bookstore-management-system-1.0-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java","-jar","my-bookstore-management-system-1.0-SNAPSHOT.jar"]