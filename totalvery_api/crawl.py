from .serializers import RestaurantIDSerializer,CustomerSerializer

from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

import requests
from bs4 import BeautifulSoup
import re
import json

from subprocess import check_output
import time

from totalvery_api.delivery_services.crawler import UbereatsCrawler, DoordashCrawler, GrubhubCrawler

@csrf_exempt
@api_view(['POST'])
def stores_feed(request):
    if request.method == 'POST':
        #location = request.form.get("location") #sample: form에 user가 location입력 가정
        location = "Tucson"
        serializer = CustomerSerializer(data=request.data)
        if(serializer.is_valid()):
            crawlers = [GrubhubCrawler(), DoordashCrawler(),UbereatsCrawler()]
            for crawler in crawlers:
                # TODO: 각각 데이터 합치기 / 따로 보여주기에 따라 처리
                feed_json = crawler.get_feed(location)
                return Response(feed_json, status=status.HTTP_201_CREATED)
                break
               
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def store_detail(request):
    if request.method == 'POST':
        serializer = RestaurantIDSerializer(data=request.data)
        if serializer.is_valid():
            # crawler = UbereatsCrawler()
            # crawler = DoordashCrawler()
            crawler = GrubhubCrawler()

            store_json = crawler.get_store(serializer.data["ids"]["grubhubID"])

            # TODO: ubereats, doordash, grubhub에 각 id로 레스토랑 디테일 호출해와서 파싱한 뒤 적절한 것만 추려서 json으로 return

            return Response(store_json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
