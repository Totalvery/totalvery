# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

RUN pip install django gunicorn whitenoise ipdb

# copy project
COPY . /app