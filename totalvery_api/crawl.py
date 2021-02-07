import logging
import ipdb
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

import pymongo
from pymongo import MongoClient
from bson import json_util
import json
from bson import ObjectId
from totalvery_api.delivery_services.crawler import UbereatsCrawler, DoordashCrawler, GrubhubCrawler, FilterFeed
import os

from totalvery.settings import DATABASE_URI
import config

DEFAULT_SMALL_ORDER_FEE = 2
DEFAULT_MIN_SUBTOTAL = 8
DEFAULT_SERVICE_FEE_PERCENT = 0.1  # 10%


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@csrf_exempt
@api_view(['POST'])
def stores_feed(request):
    if request.method == 'POST':

        location = request.data['location']
        lat = request.data['lat']
        lon = request.data['lon']
        # check if it exists in the database

        cluster = MongoClient(config.MONGO_URI)
        db = cluster["totalvery"]
        #db.users.remove({})  # removing the existing data - > for test sake
        collection = db["totalvery"]  # mini database
        query = {
            'latitude': lat,
            'longitude': lon
        }

        data_list = collection.find(query)
        if(data_list.count() > 0):  # exists
            cursor = collection.find_one(query)
            # Converting cursor to the list  of dictionaries
            total_feed = json_util.loads(
                json_util.dumps(cursor, default="str"))
            total_feed = JSONEncoder().encode(total_feed)
        else:  # does not exist
            UbereatsCrawler().get_feed(lat, lon)
            GrubhubCrawler().get_feed(lat, lon)
            total_feed = DoordashCrawler().get_feed(lat, lon)

            # save the json file to the database
            with open('total_feed.json') as file:
                file_data = json.load(file)

            collection.insert_one(file_data)

            # create a model
            serializer = CustomerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

        cluster.close()

        # # 테스트
        # UbereatsCrawler().get_feed(lat, lon)
        # GrubhubCrawler().get_feed(lat, lon)
        # total_feed = DoordashCrawler().get_feed(lat, lon)

        return Response(total_feed, status=status.HTTP_201_CREATED)

    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
def stores_feed_filter(request):
    if request.method == 'POST':
        param= request.data['param']

        filtered_feed = FilterFeed().filter(param)
        return Response(filtered_feed, status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

def create_store_json(ID_dict, customer_location, Ubereats=False, Doordash=False, Grubhub=False, cart_size=20.00):
    '''
    gathering all types of the fare only if the store is open. Otherwise, provides the static information about the store
    '''
    dic = defaultdict()
    dic['meta'] = {'ubereats': Ubereats, 'grubhub': Grubhub, 'doordash': Doordash
                   }
    dic['ids'] = ID_dict
    dic['representative'] = None
    dic['isOpen'] = defaultdict()
    dic['offer'] = defaultdict()
    dic['openHours'] = defaultdict()
    dic['etaRange'] = defaultdict()
    dic['rating'] = defaultdict()
    dic['promotion'] = defaultdict()
    dic['fee'] = defaultdict()
    dic['fee']['smallOrderFee'] = defaultdict()
    dic['fee']['deliveryFee'] = defaultdict()
    dic['fee']['serviceFee'] = defaultdict()
    dic['menu'] = defaultdict()

    location_dic = {"address": None, "streetAddress": None, "city": None, "country": None,
                    "postalCode": None, "region": None, "latitude": None, "longitude": None}
    rating_dic = {"ratingValue": None, "reviewCount": None}

    if Ubereats:
        dic['representative'] = 'ubereats'
        uc = UbereatsCrawler()
        store_info, fee_dic = uc.get_store(
            ID_dict["ubereatsID"], customer_location['location'], [customer_location["latitude"], customer_location["longitude"]])

        # width = 1080
        try:
            dic['heroImageUrl'] = store_info['data']['heroImageUrls'][-2]['url']
        except:
            dic['heroImageUrl'] = store_info['data']['heroImageUrls'][-1]['url']
        dic['title'] = store_info['data']['title']
        dic['location'] = store_info['data']['location']
        dic['isOpen']['ubereats'] = store_info['data']['isOpen']
        dic['offer']['ubereats'] = store_info['data']['promoTrackings']
        if store_info['data']['categories'][0].startswith('$'):
            dic['priceRange'] = store_info['data']['categories'][0]  # "$$"
            dic['categories'] = " ・ ".join(
                store_info['data']['categories'][1:])
        else:
            dic['priceRange'] = ""
            dic['categories'] = " ・ ".join(
                store_info['data']['categories'][0:])
        dic['menu']['ubereats'] = {'sectionEntitiesMap': store_info['data']['sectionEntitiesMap'],
                                   'sections': store_info['data']['sections'], 'subsectionsMap': store_info['data']['subsectionsMap']}

        # "11:00 AM – 9:00 PM"
        dic['openHours']['ubereats'] = store_info['data']['sections'][0]['subtitle']

        dic['rating']['ubereats'] = store_info['data']['rating']

        if fee_dic:  # only if the store is open
            dic['etaRange']['ubereats'] = fee_dic['etaRange']
            # ex) {'min': 20, 'max': 30}

            try:
                dic['fee']['deliveryFee']['ubereats'] = fee_dic['delivery_fee']
                # ex) 3.99
            except:
                dic['fee']['deliveryFee']['ubereats'] = 0

            if 'min_small_order' in fee_dic.keys():
                if cart_size < fee_dic['min_small_order']:
                    dic['fee']['smallOrderFee']['ubereats'] = fee_dic['small_order_fee']
                else:
                    dic['fee']['smallOrderFee']['ubereats'] = 0
            else:
                dic['fee']['smallOrderFee']['ubereats'] = 0
            try:
                service_fee = cart_size * fee_dic['service_fee']
                if service_fee < fee_dic['min_service_fee']:
                    service_fee = fee_dic['min_service_fee']
            except:
                service_fee = 0
            dic['fee']['serviceFee']['ubereats'] = service_fee

            if 'ca_driver_benefits_fee' in fee_dic.keys():
                dic['ubereats_ca_driver_benefits_fee'] = fee_dic['ca_driver_benefits_fee']
                # ex) 2

            if 'promotion' in fee_dic.keys():
                dic['promotion']['ubereats'] = fee_dic['promotion']
                # ex) -2.49
        else:
            dic['fee']['smallOrderFee']['ubereats'] = 0
            dic['fee']['serviceFee']['ubereats'] = 0

    if Grubhub:
        gc = GrubhubCrawler()
        store_info, offer_info = gc.get_store(ID_dict["grubhubID"])

        if Ubereats == False or dic['isOpen']['ubereats'] == False:
            dic['representative'] = 'grubhub'
            headerbackground = store_info['restaurant']['additional_media_images']['HEADER_BACKGROUND']
            dic['heroImageUrl'] = headerbackground['base_url'] + \
                headerbackground['public_id']
            dic['title'] = store_info['restaurant']['name']
            location_dic["streetAddress"] = store_info['restaurant']['address']['street_address']
            location_dic["city"] = store_info['restaurant']['address']['locality']
            location_dic["region"] = store_info['restaurant']['address']['region']
            location_dic["postalCode"] = store_info['restaurant']['address']['zip']
            location_dic["country"] = store_info['restaurant']['address']['country']
            location_dic["latitude"] = float(
                store_info['restaurant']['latitude'])
            location_dic["longitude"] = float(
                store_info['restaurant']['longitude'])
            dic['location'] = location_dic
            dic['menu']['grubhub'] = store_info['restaurant']['menu_category_list']
            dic['categories'] = " ・ ".join(
                store_info['restaurant']['cuisines'])

        dic['isOpen']['grubhub'] = store_info['restaurant_availability']['open_delivery']
        dic['offer']['grubhub'] = offer_info['available_offers']

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

        try:
            dic['priceRange'] = int(
                store_info['restaurant']['price_rating']) * "$"
        except:
            dic['priceRange'] = ""
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
        try:
            # (str) "4"
            grubhub_rating_dic["ratingValue"] = store_info['restaurant']['rating']['rating_value']
            # "2391"
            grubhub_rating_dic["reviewCount"] = store_info['restaurant']['rating']['rating_count']
        except:
            grubhub_rating_dic["ratingValue"] = '0'
            grubhub_rating_dic["reviewCount"] = '0'
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

    if Doordash:
        dc = DoordashCrawler()
        assert 'data' in dc.get_store(ID_dict["doordashID"]).keys(
        ), f'{ID_dict["doordashID"]} ERROR: {dc.get_store(ID_dict["doordashID"])}'
        store_info = dc.get_store(ID_dict["doordashID"])[
            'data']['storepageFeed']

        if Ubereats == False and Grubhub == False:
            dic['representative'] = 'doordash'
            # TODO: fix if null
            dic['heroImageUrl'] = store_info['storeHeader']['businessHeaderImgUrl']
            dic['title'] = store_info['storeHeader']['name']
            location_dic["address"] = store_info['storeHeader']['address']['displayAddress']
            location_dic["streetAddress"] = store_info['storeHeader']['address']['street']
            location_dic["city"] = store_info['storeHeader']['address']['city']
            dic['location'] = location_dic
            dic['menu']['doordash'] = store_info['itemLists']
            dic['categories'] = store_info['storeHeader']['description'].replace(
                ', ', ' ・ ')

        dic['isOpen']['doordash'] = store_info['storeHeader']['status']['delivery']['isAvailable']

        # "11:00 AM - 8:30 PM"
        dic['openHours']['doordash'] = store_info['menuBook']['displayOpenHours']
        dic['priceRange'] = store_info['storeHeader']['priceRange'] * "$"
        if dic['isOpen']:
            # "19 - 29"
            dic['etaRange']['doordash'] = store_info['storeHeader']['status']['delivery']['minutes']
            # "$0.00 delivery fee"
            dic['fee']['deliveryFee']['doordash'] = float(
                store_info['storeHeader']['deliveryFeeLayout']['displayDeliveryFee'].strip('$').strip(' delivery fee'))
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


# diction = create_store_json({
#     'ubereatsID': "345b3c6f-8d4b-4990-94f5-d091e337ecec",
#     'doordashID': "855640",
#     'grubhubID': "2026708",
# }, {'latitude': "37.7581925", 'longitude': "-122.4121704"}, True, True, True)
