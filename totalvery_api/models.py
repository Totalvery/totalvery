from django.db import models

# Create your models here.

class Restaurant (models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    delivery_fee = models.FloatField()

    def __str__(self):
        return self.name