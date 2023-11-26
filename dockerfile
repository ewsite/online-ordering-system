#Dockerfile

# Use this image as the platform to build the app
FROM node:18-alpine


CMD TREE
# RUN npm run build
# USER node:node

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node","build/index.js"]