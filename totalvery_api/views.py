from django.shortcuts import render

from rest_framework import viewsets

from .models import Restaurant
from .serializers import RestaurantSerializer

# Create your views here.

class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.all()