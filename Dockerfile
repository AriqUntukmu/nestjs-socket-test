FROM node:20.15.0-alpine as build

WORKDIR /app
RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.15.0-alpine

# Install necessary dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji

WORKDIR /app
COPY package.json .
RUN npm install --only=production

COPY --from=build /app/dist ./dist

# Set Puppeteer environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

CMD npm run start:prod