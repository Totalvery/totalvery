from rest_framework import serializers
from .models import RestaurantIDs, Restaurant


class RestaurantIDsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantIDs
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
