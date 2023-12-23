# ----- Builder Stage -----
FROM node:16-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

# ----- Release Stage -----

FROM ghcr.io/puppeteer/puppeteer:21.6.1 AS release

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start" ]
