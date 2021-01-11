from collections import defaultdict
from .serializers import StoreDetailSerializer, CustomerSerializer

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


DEFAULT_SMALL_ORDER_FEE = 2
DEFAULT_MIN_SUBTOTAL = 8
DEFAULT_SERVICE_FEE_PERCENT = 0.1  # 10%


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


def create_store_json(ID_dict, customer_location, Ubereats=False, Doordash=False, Grubhub=False, cart_size=20.00):
    '''
    gathering all types of the fare only if the store is open. Otherwise, provides the static information about the store
    '''

    dic = defaultdict()
    dic['ids'] = ID_dict
    dic['openHours'] = defaultdict()
    dic['etaRange'] = defaultdict()
    dic['rating'] = defaultdict()
    dic['fee'] = defaultdict()
    dic['fee']['smallOrderFee'] = defaultdict()
    dic['fee']['deliveryFee'] = defaultdict()
    dic['fee']['serviceFee'] = defaultdict()
    dic['menu'] = defaultdict()

    location_dic = {"address": None, "streetAddress": None, "city": None, "country": None,
                    "postalCode": None, "region": None, "latitude": None, "longitude": None}
    rating_dic = {"ratingValue": None, "reviewCount": None}

    if Ubereats:
        uc = UbereatsCrawler()
        store_info, fee_dic = uc.get_store(
            ID_dict["ubereatsID"], [customer_location["latitude"], customer_location["longitude"]])

        # width = 1080
        dic['heroImageUrl'] = store_info['data']['heroImageUrls'][-2]['url']
        dic['title'] = store_info['data']['title']
        dic['location'] = store_info['data']['location']
        dic['isOpen'] = store_info['data']['isOpen']
        dic['priceRange'] = store_info['data']['categories'][0]  # "$$"
        uuid = store_info['data']['sections'][0]['uuid']
        dic['menu']['ubereats'] = store_info['data']['sectionEntitiesMap'][uuid]

        # "11:00 AM – 9:00 PM"
        dic['openHours']['ubereats'] = store_info['data']['sections'][0]['subtitle']
        if dic['isOpen']:
            # "20–30 Min"
            dic['etaRange']['ubereats'] = store_info['data']['etaRange']['text']
            # "$0.49 Delivery Fee"
            dic['fee']['deliveryFee']['ubereats'] = store_info['data']['fareBadge']['text']
        else:
            dic['etaRange']['ubereats'] = None
            dic['fee']['deliveryFee']['ubereats'] = None
        dic['rating']['ubereats'] = store_info['data']['rating']

        if fee_dic:  # only if the store is open
            if cart_size < fee_dic['min_small_order']:
                dic['fee']['smallOrderFee']['ubereats'] = fee_dic['small_order_fee']
            else:
                dic['fee']['smallOrderFee']['ubereats'] = 0

            service_fee = cart_size * fee_dic['service_fee']
            if service_fee < fee_dic['min_service_fee']:
                service_fee = fee_dic['min_service_fee']
            dic['fee']['serviceFee']['ubereats'] = service_fee
        else:
            dic['fee']['smallOrderFee']['ubereats'] = 0
            dic['fee']['serviceFee']['ubereats'] = 0

    if Doordash:
        dc = DoordashCrawler()
        store_info = dc.get_store(ID_dict["doordashID"])[
            'data']['storepageFeed']

        if Ubereats == False:
            dic['heroImageUrl'] = store_info['storeHeader']['businessHeaderImgUrl']
            dic['title'] = store_info['storeHeader']['name']
            location_dic["address"] = store_info['storeHeader']['address']['displayAddress']
            location_dic["streetAddress"] = store_info['storeHeader']['address']['street']
            location_dic["city"] = store_info['storeHeader']['address']['city']
            dic['location'] = location_dic
            dic['isOpen'] = store_info['storeHeader']['status']['delivery']['isAvailable']
            dic['menu']['doordash'] = store_info['itemLists']

        # "11:00 AM - 8:30 PM"
        dic['openHours']['doordash'] = store_info['menuBook']['displayOpenHours']
        dic['priceRange'] = store_info['storeHeader']['priceRange'] * "$"
        if dic['isOpen']:
            # "19 - 29"
            dic['etaRange']['doordash'] = store_info['storeHeader']['status']['delivery']['minutes']
            # "$0.00 delivery fee"
            dic['fee']['deliveryFee']['doordash'] = store_info['storeHeader']['deliveryFeeLayout']['displayDeliveryFee']
        else:
            dic['etaRange']['doordash'] = None
            dic['fee']['deliveryFee']['doordash'] = None
        doordash_rating_dic = rating_dic.copy()
        doordash_rating_dic["ratingValue"] = store_info['storeHeader']['ratings']['averageRating']
        doordash_rating_dic["reviewCount"] = store_info['storeHeader']['ratings']['numRatingsDisplayString'].split(' ')[
            0]  # "2,900+"
        dic['rating']['doordash'] = doordash_rating_dic

        if cart_size < DEFAULT_MIN_SUBTOTAL:
            dic['fee']['smallOrderFee']['doordash'] = DEFAULT_SMALL_ORDER_FEE
        else:
            dic['fee']['smallOrderFee']['doordash'] = 0

        dic['fee']['serviceFee']['doordash'] = cart_size * \
            DEFAULT_SERVICE_FEE_PERCENT

    if Grubhub:
        gc = GrubhubCrawler()
        store_info = gc.get_store(ID_dict["grubhubID"])

        if Ubereats == False and Doordash == False:
            headerbackground = store_info['restaurant']['additional_media_images']['HEADER_BACKGROUND']
            dic['heroImageUrl'] = headerbackground['base_url'] + \
                headerbackground['public_id']
            dic['title'] = store_info['restaurant']['name']
            location_dic["streetAddress"] = store_info['restaurant']['address']['street_address']
            location_dic["city"] = store_info['restaurant']['address']['locality']
            location_dic["region"] = store_info['restaurant']['address']['region']
            location_dic["postalCode"] = store_info['restaurant']['address']['zip']
            location_dic["country"] = store_info['restaurant']['address']['country']
            location_dic["latitude"] = int(
                store_info['restaurant']['latitude'])
            location_dic["longitude"] = int(
                store_info['restaurant']['longitude'])
            dic['location'] = location_dic
            dic['isOpen'] = store_info['restaurant_availability']['open_delivery']
            dic['menu']['grubhub'] = store_info['restaurant']['menu_category_list']

        # {
        #     "day_of_week": 1,
        #     "time_ranges": [
        #       "18:00-03:45"
        #     ]
        #   },
        #   {
        #     "day_of_week": 2,
        #     "time_ranges": [
        #       "18:00-03:45"
        #     ]
        #   },
        # TODO: ignore timezone
        dic['openHours']['grubhub'] = store_info['restaurant_availability']['available_hours']

        dic['priceRange'] = int(store_info['restaurant']['price_rating']) * "$"
        if dic['isOpen']:
            # "30 - 40"
            dic['etaRange']['grubhub'] = str(store_info['restaurant_availability']['delivery_estimate_range_v2']['minimum']) + " - " + str(
                store_info['restaurant_availability']['delivery_estimate_range_v2']['maximum'])
            # (float) 0.99
            dic['fee']['deliveryFee']['grubhub'] = round(
                store_info['restaurant_availability']['delivery_fee']['amount']/100, 2)
        else:
            dic['etaRange']['grubhub'] = None
            dic['fee']['deliveryFee']['grubhub'] = None
        grubhub_rating_dic = rating_dic.copy()
        # (str) "4"
        grubhub_rating_dic["ratingValue"] = store_info['restaurant']['rating']['rating_value']
        # "2391"
        grubhub_rating_dic["reviewCount"] = store_info['restaurant']['rating']['rating_count']
        dic['rating']['grubhub'] = grubhub_rating_dic

        try:
            small_order_fee = store_info['restaurant_availability']['small_order_fee']
            if cart_size < small_order_fee['minimum_order_value_cents']/100:
                dic['fee']['smallOrderFee']['grubhub'] = (
                    small_order_fee['fee']['flat_cents_value']['amount'])/100  # (float) 2.00
            else:
                dic['fee']['smallOrderFee']['grubhub'] = 0
        except:
            dic['fee']['smallOrderFee']['grubhub'] = 0

        try:
            dic['fee']['serviceFee']['grubhub'] = (
                store_info['restaurant_availability']['service_fee']['delivery_fee']['percent_value'])/100 * cart_size
        except:
            dic['fee']['serviceFee']['grubhub'] = 0

    return dic


@csrf_exempt
@api_view(['POST'])
def store_detail(request):
    if request.method == 'POST':
        serializer = StoreDetailSerializer(data=request.data)
        if serializer.is_valid():
            compressed_store_json = create_store_json(
                serializer.data["ids"], serializer.data['customer_location'], serializer.data['meta']['ubereats'], serializer.data['meta']['doordash'], serializer.data['meta']['grubhub'])
            # ubereats, doordash, grubhub에 각 id로 레스토랑 디테일 호출해와서 파싱한 뒤 적절한 것만 추려서 json으로 return
            return Response(compressed_store_json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
