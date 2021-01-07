from collections import defaultdict
from .serializers import RestaurantIDSerializer, CustomerSerializer

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
        # location = request.form.get("location") #sample: form에 user가 location입력 가정
        location = "Tucson"
        serializer = CustomerSerializer(data=request.data)
        if(serializer.is_valid()):
            crawlers = [GrubhubCrawler(), DoordashCrawler(), UbereatsCrawler()]
            for crawler in crawlers:
                # TODO: 각각 데이터 합치기 / 따로 보여주기에 따라 처리
                feed_json = crawler.get_feed(location)
                return Response(feed_json, status=status.HTTP_201_CREATED)
                break

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def create_store_json(ID_dict, Ubereats=False, Doordash=False, Grubhub=False, cart_size=2000):
    dic = defaultdict()
    dic['ids'] = ID_dict
    dic['openHours'] = defaultdict()
    dic['etaRange'] = defaultdict()
    dic['rating'] = defaultdict()
    dic['fee'] = defaultdict()
    dic['fee']['deliveryFee'] = defaultdict()
    dic['fee']['serviceFee'] = defaultdict()
    dic['menu'] = defaultdict()
    if Ubereats:
        crawler = UbereatsCrawler()
        store_info = crawler.get_store(ID_dict["ubereatsID"])
        dic['heroImageUrl'] = store_info['data']['heroImageUrls'][0]['url']
        dic['title'] = store_info['data']['title']
        dic['location'] = store_info['data']['location']
        dic['isOpen'] = store_info['data']['isOpen']
        # "11:00 AM – 9:00 PM"
        dic['openHours']['ubereats'] = store_info['data']['sections'][0]['subtitle']
        dic['priceRange'] = store_info['data']['categories'][0]  # "$$"
        # "20–30 Min"
        dic['etaRange']['ubereats'] = store_info['data']['etaRange']['text']
        dic['rating']['ubereats'] = store_info['data']['rating']
        # "$0.49 Delivery Fee"
        dic['fee']['deliveryFee']['ubereats'] = store_info['data']['fareBadge']['text']
        dic['fee']['serviceFee']['ubereats'] = crawler.estimate_service_fee(
            cart_size)  # set the default of cart size as $20
        uuid = store_info['data']['sections'][0]['uuid']
        dic['menu']['ubereats'] = store_info['data']['sectionEntitiesMap'][uuid]

    # TODO: if Doordash, Grubhub

    return dic


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

            compressed_store_json = create_store_json(serializer.data["ids"], serializer.data['meta']['ubereats'],
                                                      serializer.data['meta']['doordash'], serializer.data['meta']['grubhub'])

            # TODO: ubereats, doordash, grubhub에 각 id로 레스토랑 디테일 호출해와서 파싱한 뒤 적절한 것만 추려서 json으로 return

            return Response(compressed_store_json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
