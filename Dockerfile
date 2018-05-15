
FROM node:alpine as builder

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package.json /src/app/package.json

RUN npm install

COPY . /src/app

EXPOSE 3000

CMD [ "npm", "build"]

FROM nginx:alpine

COPY --from=builder /src/app/build /usr/share/nginx/html