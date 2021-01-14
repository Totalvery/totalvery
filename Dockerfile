# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

<<<<<<< HEAD
RUN pip install django djangorestframework gunicorn whitenoise ipdb
RUN npx create-react-app totalvery_react
RUN npm install --save google-map-react
RUN npm start
=======
RUN pip install requests BeautifulSoup4 django djangorestframework gunicorn whitenoise ipdb django-cors-headers 

# RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends apt-utils
# RUN apt-get install npm -y
# RUN npm init

# CMD ["npm", "start"]

>>>>>>> ec51310a709b948b18c2ee53e0c6e92402719053

# copy project
COPY . /app