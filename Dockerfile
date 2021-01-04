# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

RUN pip install requests BeautifulSoup4 django djangorestframework gunicorn whitenoise ipdb

# copy project
COPY . /app