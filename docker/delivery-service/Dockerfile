
FROM node:19-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/delivery-service/package*.json ./apps/delivery-service/

RUN npm ci --workspace=apps/delivery-service

COPY . .

RUN npm run build:delivery

FROM node:19-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/delivery-service ./dist

ENV NODE_ENV production
ENV PORT 3003

EXPOSE 3003
CMD ["node", "dist/main"]