from rest_framework import serializers
from .models import RestaurantID, Restaurant


class NestedMetaSerializer(serializers.Serializer):
    ubereats = serializers.BooleanField()
    doordash = serializers.BooleanField()
    grubhub = serializers.BooleanField()


class NestedIDSerializer(serializers.Serializer):
    ubereatsID = serializers.CharField()
    doordashID = serializers.CharField()
    grubhubID = serializers.CharField()


class RestaurantIDSerializer(serializers.ModelSerializer):
    meta = NestedMetaSerializer(source='*')
    ids = NestedIDSerializer(source='*')

    class Meta:
        model = RestaurantID
        fields = ['meta', 'ids']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
