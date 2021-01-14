from rest_framework import serializers
from .models import StoreDetail, Restaurant,Customer


class NestedMetaSerializer(serializers.Serializer):
    ubereats = serializers.BooleanField()
    doordash = serializers.BooleanField()
    grubhub = serializers.BooleanField()

class NestedLocationSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

class NestedIDSerializer(serializers.Serializer):
    ubereatsID = serializers.CharField()
    doordashID = serializers.CharField()
    grubhubID = serializers.CharField()


class StoreDetailSerializer(serializers.ModelSerializer):
    meta = NestedMetaSerializer(source='*')
    customer_location = NestedLocationSerializer(source='*')
    ids = NestedIDSerializer(source='*')

    class Meta:
        model = StoreDetail
        fields = ['meta', 'customer_location', 'ids']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields= '__all__'