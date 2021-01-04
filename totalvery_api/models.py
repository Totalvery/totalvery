from django.db import models

# Create your models here.

class RestaurantIDs (models.Model):
    ubereatsID  = models.CharField(max_length=100)
    doordashID = models.CharField(max_length=100)
    grubhubID = models.CharField(max_length=100) 


class Restaurant (models.Model): # 테스트용으로 만들어 본 임시 모델임. 
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    delivery_fee = models.FloatField()

    def __str__(self):
        return self.name