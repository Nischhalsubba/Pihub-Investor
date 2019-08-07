FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g gulp-cli

EXPOSE 3000
CMD ["gulp","serve"]
