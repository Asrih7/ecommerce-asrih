#stage 1
FROM node:latest as node
WORKDIR /app
COPY . . 
RUN npm install --force
RUN npm install  -g @angular/cli
RUN npm run build


#stage 2
FROM nginx:alpine
RUN mkdir /var/ssl
COPY --from=node /app/default-prod.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist /usr/share/nginx/html