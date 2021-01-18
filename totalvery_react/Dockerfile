FROM node

WORKDIR /app/totalvery_react
COPY package.json /app/totalvery_react

RUN npm i react react-dom react-router-dom react-google-autocomplete
RUN npm install --save google-map-react

EXPOSE 3000
CMD ["npm", "start"]