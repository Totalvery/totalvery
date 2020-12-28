# pull official base image
FROM python:3.8

# set work directory
WORKDIR /app

RUN pip install django gunicorn whitenoise ipdb

# copy project
COPY . /app

# collect static files
RUN python manage.py collectstatic --noinput

# run gunicorn
CMD python manage.py runserver 0.0.0.0:8000