# --- BUILD stage ---
FROM node:16.15-alpine3.15 AS build

RUN echo "Building API from production"

WORKDIR /app

RUN echo "Installing..."
COPY package*.json ./
RUN npm install

RUN echo "Building..."
COPY . .
RUN npm run build

# --- RUN stage ---
FROM node:16.15-alpine3.15

WORKDIR /app

RUN echo "Installing..."
COPY package.json ./
# Needed to ignore husky prepare
RUN npm install --omit=dev --ignore-scripts

RUN echo "Running..."
COPY --from=build /app/dist ./
RUN npm install --location=global pm2

# Default command on container run CMD (overwritted) / ENTRYPOINT
CMD [ "pm2-runtime", "server.js" ]
