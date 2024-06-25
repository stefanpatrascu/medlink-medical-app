FROM node:20-alpine as builder

ARG PROFILE
ENV PROFILE_ENV=$PROFILE

WORKDIR "/app"
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .

RUN rm -rf ./.angular/cache

RUN npm run build-$PROFILE_ENV

FROM nginx:1.23.3-alpine
EXPOSE 8080
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/medical-app-fe /usr/share/nginx/html
