FROM node:slim

# Setting up the work directory
WORKDIR /usr/src/app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

CMD [ "node", "src/express.js"]

# Exposing server port
EXPOSE 9000