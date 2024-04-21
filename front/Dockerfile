FROM node:20

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY . /app

EXPOSE 5030
CMD ["npm", "start"]