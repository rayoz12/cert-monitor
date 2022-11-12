# Multi stage build for building svelte

# 1. Build svelte
FROM node as web_builder

WORKDIR /web

COPY client .

RUN npm install && rm -rf ./public/build && npm run build

# 2. Server
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY server/package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY server .

# Copy from web_builder
COPY --from=web_builder /web/dist ./public

EXPOSE 8080
CMD [ "node", "index.js" ]
