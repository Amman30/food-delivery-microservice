
FROM node:19-alpine AS builder
WORKDIR /app


COPY package*.json ./
COPY apps/user-service/package*.json ./apps/user-service/


RUN npm ci --workspace=apps/user-service


COPY . .


RUN npm run build:user


FROM node:19-alpine
WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/user-service ./dist


ENV NODE_ENV production
ENV PORT 3001


EXPOSE 3001
CMD ["node", "dist/main"]