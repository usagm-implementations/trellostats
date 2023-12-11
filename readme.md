# Installation

### Clone from GitHub

1. `git clone `

### Install and set up Docker

1. **Download Docker**: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
2. Create account/Log in on Docker

### Run application

1. Navigate to application on your terminal/command line
2. While Docker is running, build image: `docker build . -t <docker username>/trellostats`
3. Run image: `docker run -p 49160:9000 -d <docker username>/trellostats`
4. Navigate to [http://localhost:49160/](http://localhost:49160/)
