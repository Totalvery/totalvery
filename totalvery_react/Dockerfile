FROM node

WORKDIR /app/totalvery_react
COPY package.json /app/totalvery_react

RUN npm i react react-dom react-router-dom react-google-autocomplete

RUN npm install --save google-map-react react-image react-scroll react-cookie
RUN npm install --save react-bootstrap bootstrap @material-ui/core bootstrap
# RUN npm install react-bootstrap bootstrap
# RUN npm install @material-ui/core
# RUN npm install bootstrap --save

EXPOSE 3000
CMD ["npm", "start"]