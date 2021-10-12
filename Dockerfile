FROM node:lts AS builder
WORKDIR /opt/app

COPY . .

RUN yarn

RUN yarn run generate-conf && yarn build

FROM nginx:stable
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=1000:1000 --from=builder /opt/app/build .
