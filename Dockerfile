# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

RUN pip install django djangorestframework gunicorn whitenoise ipdb
RUN npx create-react-app totalvery_react
RUN npm install --save google-map-react
RUN npm start

# copy project
COPY . /app