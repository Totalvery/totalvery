# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

RUN pip install requests BeautifulSoup4 django djangorestframework gunicorn whitenoise ipdb

# RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends apt-utils
# RUN apt-get install npm -y
# RUN npm init

# CMD ["npm", "start"]


# copy project
COPY . /app