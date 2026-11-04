FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY public/ ./public/

ENV DATA_DIR=/app/data
RUN mkdir -p /app/data ./src/data && chown -R node:node /app/data ./src/data

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

USER node

CMD ["node", "src/server.js"]
