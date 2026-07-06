FROM node:20-slim AS builder
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-slim AS runner
ENV NODE_ENV=production
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# if bcrypt fails to build add python3 make g++
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
# app reads swagger.json at runtime
COPY --from=builder /app/src/docs/swagger.json ./src/docs/swagger.json

RUN chown -R node:node /app
USER node

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||5000)+'/').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
