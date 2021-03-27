FROM maven:3.6.3-openjdk-8-slim as gatling_base

ENV GATLING_VERSION=3.5.1

ARG DEBIAN_FRONTEND="noninteractive"
ENV TZ=Asia/Singapore

RUN apt-get update -y && apt-get install -y unzip

WORKDIR /opt

RUN curl -L -s -o gatling-charts-highcharts-bundle-${GATLING_VERSION}-bundle.zip https://repo1.maven.org/maven2/io/gatling/highcharts/gatling-charts-highcharts-bundle/${GATLING_VERSION}/gatling-charts-highcharts-bundle-${GATLING_VERSION}-bundle.zip \
    && unzip gatling-charts-highcharts-bundle-${GATLING_VERSION}-bundle.zip \
    && rm gatling-charts-highcharts-bundle-${GATLING_VERSION}-bundle.zip \
    && ln -s gatling-charts-highcharts-bundle-${GATLING_VERSION} gatling

ENV GATLING_HOME="/opt/gatling"
ENV PATH="${GATLING_HOME}/bin:${PATH}"
ENV GATLING_CLASSPATH="${GATLING_HOME}/lib"

ARG USER_HOME_DIR="/root"
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"
VOLUME "$USER_HOME_DIR/.m2"

WORKDIR /tests
COPY pom.xml /tests
COPY src /tests
RUN mvn -B -f /tests/pom.xml -s /usr/share/maven/ref/settings-docker.xml dependency:copy-dependencies -DoutputDirectory="${GATLING_CLASSPATH}"

ENV GATLING_CONF=/tests/resources
