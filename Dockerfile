FROM node:20.5.0-alpine AS build
WORKDIR /app
COPY ./package.json ./package-lock.json ./.eslintrc.json ./tsconfig.base.json ./
RUN npm i --force
COPY ./ ./apps/stack-overflow
RUN npm run build

FROM node:20.5.0-alpine
WORKDIR /app
COPY --from=build /app/dist/apps/stack-overflow/package.json ./
COPY --from=build /app/dist/apps/stack-overflow/package-lock.json ./
COPY --from=build /app/dist/apps/stack-overflow ./
RUN npm i
EXPOSE 3000
CMD ["node", "main.js"]