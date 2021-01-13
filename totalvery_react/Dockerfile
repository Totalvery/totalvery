FROM node

WORKDIR /app/totalvery_react
COPY package.json /app/totalvery_react

RUN npm i react react-dom react-router-dom react-google-autocomplete

EXPOSE 3000
CMD ["npm", "start"]