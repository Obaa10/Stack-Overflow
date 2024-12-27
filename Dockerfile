FROM node:20.5.0-alpine AS build
WORKDIR /app
COPY ./package.json ./package-lock.json ./.eslintrc.json ./tsconfig.base.json ./
RUN npm i --force
COPY ./ ./apps/misraj
RUN npm run build

FROM node:20.5.0-alpine
WORKDIR /app
COPY --from=build /app/dist/apps/misraj/package.json ./
COPY --from=build /app/dist/apps/misraj/package-lock.json ./
COPY --from=build /app/dist/apps/misraj ./
RUN npm i
EXPOSE 3000
CMD ["node", "main.js"]