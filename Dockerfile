FROM ubuntu:22.04

RUN apt-get update && apt-get install -y npm

RUN NPM START