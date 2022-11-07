#  Dockerfile for Node Express Backend api (development)

FROM node:16.18-alpine

#ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN yarn install

# Copy app source code
COPY . .

RUN yarn prisma generate

# RUN yarn prisma db push

RUN yarn build

# Exports
EXPOSE 3000

CMD [ "yarn", "start" ]
