from .serializers import RestaurantIDsSerializer

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
def store_detail(request):
    if request.method == 'POST':
        serializer = RestaurantIDsSerializer(data=request.data)
        if serializer.is_valid():
            # crawler = UbereatsCrawler()
            # crawler = DoordashCrawler()
            crawler = GrubhubCrawler()

            store_json = crawler.get_store(serializer.data["grubhubID"])

            # TODO: ubereats, doordash, grubhub에 각 id로 레스토랑 디테일 호출해와서 파싱한 뒤 적절한 것만 추려서 json으로 return

            return Response(store_json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
