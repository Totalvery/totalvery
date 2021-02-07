from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import RestaurantViewSet
from .crawl import store_detail,stores_feed,stores_feed_filter


router = DefaultRouter()
router.register('restaurant', RestaurantViewSet, basename='restaurant')

urlpatterns = [
    path('', include(router.urls)),
    path('getStoreDetails/', store_detail),
    path('getFeed/',stores_feed),
    path('getFeedFilter/',stores_feed_filter)
]