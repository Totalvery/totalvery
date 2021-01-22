# pull official base image
FROM python:latest

# set work directory
WORKDIR /app

RUN pip install requests BeautifulSoup4 django djangorestframework gunicorn whitenoise ipdb django-cors-headers pymongo pymongo[srv]

# RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends apt-utils
# RUN apt-get install npm -y
# RUN npm init

# CMD ["npm", "start"]

CMD python3 manage.py runserver 0.0.0.0:$PORT

# copy project
COPY . /app