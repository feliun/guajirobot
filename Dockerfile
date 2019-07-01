FROM node:10.4

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npm run manifest

ENTRYPOINT [ "npm", "start" ]