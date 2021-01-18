from django.db import models

# Create your models here.


class StoreDetail (models.Model):
    ubereats = models.BooleanField(default=False)
    doordash = models.BooleanField(default=False)
    grubhub = models.BooleanField(default=False)
    ubereatsID = models.CharField(max_length=100, blank=True, null=True)
    doordashID = models.CharField(max_length=100, blank=True, null=True)
    grubhubID = models.CharField(max_length=100, blank=True, null=True)

    # customer location
    latitude = models.FloatField() 
    longitude = models.FloatField()

class Restaurant (models.Model):  # 테스트용으로 만들어 본 임시 모델임.
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    delivery_fee = models.FloatField()

    def __str__(self):
        return self.name

class Customer (models.Model):
    location = models.CharField(max_length=100)