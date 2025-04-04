
FROM node:19-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/restaurant-service/package*.json ./apps/restaurant-service/

RUN npm ci --workspace=apps/restaurant-service

COPY . .

RUN npm run build:restaurant


FROM node:19-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/restaurant-service ./dist

ENV NODE_ENV production
ENV PORT 3002

EXPOSE 3002
CMD ["node", "dist/main"]