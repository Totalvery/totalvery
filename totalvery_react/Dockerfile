FROM node

WORKDIR /app/totalvery_react
COPY package.json /app/totalvery_react

RUN npm install
RUN npm install react-router-dom --save

EXPOSE 3000
CMD ["npm", "start"]