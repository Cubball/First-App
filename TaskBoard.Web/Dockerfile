FROM node:latest AS build
WORKDIR /app/

COPY ./TaskBoard.Web/package*.json .
RUN npm ci
RUN npm i -g @angular/cli

COPY ./TaskBoard.Web/ .
RUN npm run build --configuration=production

FROM nginx:latest
COPY ./TaskBoard.Web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/task-board.web/browser/ /usr/share/nginx/html
EXPOSE 80
