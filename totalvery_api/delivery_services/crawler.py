import ipdb
import requests
from bs4 import BeautifulSoup
import re
import json

from subprocess import check_output
import time

from collections import defaultdict


class UbereatsCrawler:

    def __init__(self):
        self.headers = {}
        self.payload = ""
        self.s = requests.Session()
        self.customer_location = []

    def create_headers(self):
        pass

    def set_location_cookie(self, keyword):
        self.headers = {"x-csrf-token": "x"}
        location_json = json.loads(keyword)
        location_str = json.dumps(location_json)

        location_cookie = 'uev2.loc=' + location_str
        self.headers.update({'cookie': location_cookie, 'content-type': 'application/json',
                             'accept': '*/*'})

    def add_cart(self, session, store_json, restaurant_id):
        

        sectionEntitiesMap = store_json['data']['sectionEntitiesMap']
        for k, v in sectionEntitiesMap.items():

            for sub_k, sub_v in sectionEntitiesMap[k].items():
                if not sub_v['hasCustomizations']:
                    uuid = sub_k
                    sectionUuid = k

                    data = '{"cartItems":[{"shoppingCartItemUuid":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","uuid":"' + uuid + '","storeUuid":"'+restaurant_id+'","sectionUuid":"' + sectionUuid + '","subsectionUuid":"00000000-0000-0000-0000-000000000000","quantity":1,"customizations":{},"createdTimestamp":0}],"location":{"latitude":' + \
                        str(self.customer_location[0])+',"longitude":'+str(
                            self.customer_location[1])+'},"deliveryType":"ASAP","interactionType":"door_to_door"}'

                    response = session.post(
                        'https://www.ubereats.com/api/getOrderEstimateV1', data=data)
                    if response.json()['status'] == 'success':
                        return response
                    else:
                        print(response.json()['data']['message'])
                        if response.json()['data']['message'] == 'Order Location is too far from store':

                            self.customer_location = [store_json['data']['location']
                                                      ['latitude'], store_json['data']['location']['longitude']]

        assert uuid != "", "No items available to add"
        return None

    def estimate_service_fee(self, session, restaurant_id, store_json, customer_location=None):
        '''
        @params customer_location (list): [lat, lon]
        '''
        if customer_location:
            self.customer_location = customer_location
        elif self.customer_location == []:
            self.customer_location = [store_json['data']['location']
                                      ['latitude'], store_json['data']['location']['longitude']]
                            
        response = self.add_cart(session, store_json, restaurant_id)
    
        while True:
            try:
                dic = defaultdict()
                dic['etaRange'] = response.json()['data']['etaRange']
                charges = response.json()['data']['charges']
                for each in charges:
                    if each['label'] == 'Small Order Fee':
                        small_order_fee = each['rawValue']  # 2
                        small_order_txt = each['bottomSheet']['body'][0]['children'][0]['text']
                        min_small_order = float(re.findall(
                            r'\d*\.\d+|\d+', small_order_txt)[0])

                        dic['small_order_fee'] = small_order_fee
                        dic['min_small_order'] = min_small_order

                    elif each['label'] == 'Promotion':
                        promotion = each['rawValue']  # 0.99

                        dic['promotion'] = promotion

                    elif each['label'] == 'Delivery Fee':
                        delivery_fee = each['rawValue']  # 0.99

                        dic['delivery_fee'] = delivery_fee

                    elif each['label'] == 'Service Fee':
                        service_fee_txt = each['bottomSheet']['body'][0]['children'][0]['text']
                        service_fee_txt = re.findall(
                            r'\d*\.\d+|\d+', service_fee_txt)
                        service_fee = float(service_fee_txt[0])/100
                        min_service_fee = float(service_fee_txt[1])

                        dic['service_fee'] = service_fee
                        dic['min_service_fee'] = min_service_fee

                    elif each['label'] == 'CA Driver Benefits':
                        ca_driver_benefits_fee = each['rawValue']
                        dic['ca_driver_benefits_fee'] = ca_driver_benefits_fee

                return dic

            except:

                print(response.json()['data']['message'])
                # self.customer_location = [store_json['data']['location']
                #                           ['latitude'], store_json['data']['location']['longitude']]
                # if uuid and sectionUuid:
                #     data = '{"cartItems":[{"shoppingCartItemUuid":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","uuid":"' + uuid + '","storeUuid":"'+restaurant_id+'","sectionUuid":"' + sectionUuid + '","subsectionUuid":"00000000-0000-0000-0000-000000000000","quantity":1,"customizations":{},"createdTimestamp":0}],"location":{"latitude":' + \
                #         str(self.customer_location[0])+',"longitude":'+str(
                #             self.customer_location[1])+'},"deliveryType":"ASAP","interactionType":"door_to_door"}'

                #     response = session.post(
                #         'https://www.ubereats.com/api/getOrderEstimateV1/', data=data)

    def get_store(self, restaurantId, keyword, customer_location=None):
        self.set_location_cookie(keyword)
        data = '{"storeUuid":"'+restaurantId+'"}'

        with requests.Session() as s:
            s.headers.update(self.headers)
            response = s.post(
                'https://www.ubereats.com/api/getStoreV1', data=data)
            store_json = response.json()

            if store_json['data']['isOpen']:
                fee_dic = self.estimate_service_fee(
                    s, restaurantId, store_json, customer_location)
            else:
                fee_dic = None

            return store_json, fee_dic

    def get_feed(self, lat, lon):
        headers = {"x-csrf-token": "x"}
        s = requests.Session()
        self.customer_location = (
            lat, lon)
        location_json = {"latitude": lat, "longitude": lon}
        location_str = json.dumps(location_json)
        location_cookie = 'uev2.loc=' + location_str
        headers.update({'cookie': location_cookie, 'content-type': 'application/json',
                        'accept': '*/*'})

        dict_stores = {}
        offset = 1
        while True:
            data = '{"pageInfo":{"offset":' + \
                str(offset)+',"pageSize":80}}'

            response = s.post(
                'https://www.ubereats.com/api/getFeedV1/', headers=headers, data=data)

            feed_json = response.json()['data']
      
            #assert feed_json['storesMap'] != None, f"feed_json:\n{feed_json}"
            if "message" in feed_json: #no stores available message
                break
            stores = feed_json['storesMap']
            meta = feed_json['meta']
            dict_stores.update(stores)

            if meta['hasMore']:
                offset = meta['offset']
            else:
                break

        dictionary = {
            "latitude": lat,
            "longitude": lon,
            "data": {

            }
        }
        feed_list = []
        if "storesMap" in feed_json: #if stores are available
            for key in dict_stores.keys():
                if(dict_stores[key]['isOpen'] == True):
                    restaurantId = key
                    store_name = dict_stores[key]['title']
                    store_img = dict_stores[key]['heroImageUrl']
                    # if(store_img ==""):
                    #     store_img = "../no-image.png"
                    if(dict_stores[key]['feedback'] != None):
                        store_rating = dict_stores[key]['feedback']['rating']
                    else:
                        store_rating = 0

                    if(dict_stores[key]['meta']['deliveryFee'] != None):
                        delivery_fee = dict_stores[key]['meta']['deliveryFee']['text']
                    else:
                        delivery_fee = 'None'

                    a_dict = {
                        'name': store_name,
                        'data': {
                            'image': store_img,
                            'rating': store_rating,
                            'platform': [{

                                'ubereats': {
                                    'support': True,
                                    'id': restaurantId,
                                    'delivery_fee': delivery_fee,
                                },
                                'doordash': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',
                                },
                                'grubhub': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',
                                },
                            }]
                        }
                    }
                    feed_list.append(a_dict)
        dictionary['data'] = feed_list
        with open('total_feed.json', mode='w') as f:
            f.write(json.dumps(dictionary, indent=2))


class DoordashCrawler:

    def __init__(self):
        self.headers = {}
        self.payload = ""

    def create_headers(self):
        pass

    def search_all_stores(self, session, searchStore, limit):
        LIMIT = 200  # max num of searchStores
        assert LIMIT <= 200, "the maximum of limit is 200"
        total_num = searchStore['data']['storeSearch']['numStores']
        if total_num > limit:
            offsets = total_num // limit  # max limits == 200
            offset = 0
            for i in range(offsets):
                offset += limit
                data2 = "{\"operationName\":\"storeSearch\",\"variables\":{\"searchLat\":null,\"searchLng\":null,\"offset\":" + str(offset) + ",\"limit\":"+str(
                    limit)+",\"searchQuery\":null,\"filterQuery\":null,\"categoryQueryId\":null},\"query\":\"query storeSearch($offset: Int!, $limit: Int!, $order: [String!], $searchQuery: String, $filterQuery: String, $categoryQueryId: ID, $searchLat: Float, $searchLng: Float) {    storeSearch(offset: $offset, limit: $limit, order: $order, searchQuery: $searchQuery, filterQuery: $filterQuery, categoryQueryId: $categoryQueryId, searchLat: $searchLat, searchLng: $searchLng) {    showListAsPickup    numStores    stores {      id      name      description      averageRating      numRatings      numRatingsDisplayString    priceRange      featuredCategoryDescription      deliveryFee      extraSosDeliveryFee      displayDeliveryFee      headerImgUrl      url      isConsumerSubscriptionEligible      distanceFromConsumer      distanceFromConsumerInMeters      distanceFromConsumerString      menus {        popularItems {          imgUrl          __typename        }        __typename      }      merchantPromotions {        id        categoryNewStoreCustomersOnly        deliveryFee        minimumSubtotal        __typename      }      status {        unavailableReason        asapAvailable        scheduledAvailable        asapMinutesRange        asapPickupMinutesRange        __typename      }      location {        lat        lng        __typename      }      badge {        backgroundColor        text        __typename      }      __typename    }    storeItems {      id      name      price      imageUrl      store {        name        url        id        __typename      }      __typename    }    __typename  }}\"}"
                stores = session.post(
                    'https://www.doordash.com/graphql/', data=data2).json()['data']['storeSearch']['stores']
                searchStore['data']['storeSearch']['stores'] += stores

        return searchStore

    def get_store(self, restaurantId):
        url = "https://www.doordash.com/graphql/"
        if len(self.headers) == 0:
            headers = {
                'content-type': "application/json"
            }

        self.payload = '{"operationName":"storepageFeed","variables":{"fulfillmentType":"Delivery","storeId":"' + str(restaurantId) + '","isMerchantPreview":false,"includeDifferentialPricingEnabled":true},"query":"query storepageFeed($storeId: ID\u0021, $menuId: ID, $isMerchantPreview: Boolean, $fulfillmentType: FulfillmentType, $includeDifferentialPricingEnabled: Boolean\u0021) {  storepageFeed(storeId: $storeId, menuId: $menuId, isMerchantPreview: $isMerchantPreview, fulfillmentType: $fulfillmentType) {    storeHeader {      id      name      description      priceRange      offersDelivery      offersPickup      offersGroupOrder      isConvenience      isDashpassPartner      address {        city        street        displayAddress        cityLink        __typename      }      business {        id        name        link        ... @include(if: $includeDifferentialPricingEnabled) {          differentialPricingEnabled          __typename        }        __typename      }      businessTags {        name        link        __typename      }      deliveryFeeLayout {        title        subtitle        isSurging        displayDeliveryFee        __typename      }      deliveryFeeTooltip {        title        description        __typename      }      coverImgUrl      coverSquareImgUrl      businessHeaderImgUrl      ratings {        numRatings        numRatingsDisplayString        averageRating        isNewlyAdded        __typename      }      distanceFromConsumer {        value        label        __typename      }      enableSwitchToPickup      asapStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      asapPickupStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      status {        delivery {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isTooFarFromConsumer          isStoreInactive          __typename        }        pickup {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isStoreInactive          __typename        }        __typename      }      __typename    }    banners {      pickup {        id        title        text        __typename      }      catering {        id        text        __typename      }      demandGen {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      demandTest {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      __typename    }    carousels {      id      type      name      description      items {        id        name        description        displayPrice        imgUrl        dynamicLabelDisplayString        calloutDisplayString        nextCursor        orderItemId        reorderCartId        reorderUuid        unitAmount        currency        __typename      }      __typename    }    menuBook {      id      name      displayOpenHours      menuCategories {        id        name        numItems        next {          anchor          cursor          __typename        }        __typename      }      menuList {        id        name        displayOpenHours        __typename      }      __typename    }    itemLists {      id      name      description      items {        id        name        description        displayPrice        imageUrl        dynamicLabelDisplayString        calloutDisplayString        __typename      }      __typename    }    disclaimersList {      id      text      __typename    }    __typename  }}"}'
        # self.payload = "{\"operationName\":\"storepageFeed\",\"variables\":{\"fulfillmentType\":\"Delivery\",\"storeId\": \"" + str(restaurantId) + "\",\"isMerchantPreview\":false,\"isStorePageFeedMigration\":true,\"includeDifferentialPricingEnabled\":true},\"query\":\"query storepageFeed($storeId: ID\\u0021, $menuId: ID, $isMerchantPreview: Boolean, $fulfillmentType: FulfillmentType, $includeDifferentialPricingEnabled: Boolean\\u0021) {  storepageFeed(isStorePageFeedMigration: true, storeId: $storeId, menuId: $menuId, isMerchantPreview: $isMerchantPreview, fulfillmentType: $fulfillmentType) {    storeHeader {      id      name      description      priceRange      offersDelivery      offersPickup      offersGroupOrder      isConvenience      isDashpassPartner      address {        city        street        displayAddress        cityLink        __typename      }      business {        id        name        link        ... @include(if: $includeDifferentialPricingEnabled) {          differentialPricingEnabled          __typename        }        __typename      }      businessTags {        name        link        __typename      }      deliveryFeeLayout {        title        subtitle        isSurging        displayDeliveryFee        __typename      }      deliveryFeeTooltip {        title        description        __typename      }      coverImgUrl      coverSquareImgUrl      businessHeaderImgUrl      ratings {        numRatings        numRatingsDisplayString        averageRating        isNewlyAdded        __typename      }      distanceFromConsumer {        value        label        __typename      }      enableSwitchToPickup      asapStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      asapPickupStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      status {        delivery {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isTooFarFromConsumer          isStoreInactive          __typename        }        pickup {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isStoreInactive          __typename        }        __typename      }      __typename    }    banners {      pickup {        id        title        text        __typename      }      catering {        id        text        __typename      }      demandGen {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      demandTest {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      __typename    }    carousels {      id      type      name      description      items {        id        name        description        displayPrice        imgUrl        calloutDisplayString        nextCursor        orderItemId        reorderCartId        reorderUuid        unitAmount        currency        __typename      }      __typename    }    menuBook {      id      name      displayOpenHours      menuCategories {        id        name        numItems        next {          anchor          cursor          __typename        }        __typename      }      menuList {        id        name        displayOpenHours        __typename      }      __typename    }    itemLists {      id      name      description      items {        id        name        description        displayPrice        imageUrl        calloutDisplayString        __typename      }      __typename    }    disclaimersList {      id      text      __typename    }    __typename  }}\"}"
        response = requests.request(
            "POST", url, data=self.payload, headers=headers)
        try:
            store_json = response.json()
        except:
            raise Exception(
                f"Doordash food delivery is not available in your country. Your response is '{response.text}'")
        return store_json

    def get_feed(self, lat, lon):
        LIMIT = 200  # max num of searchStores
        assert LIMIT <= 200, "the maximum of limit is 200"

        headers = {
            'content-type': 'application/json',
        }

        data = '{"operationName":"addConsumerAddress","variables":{"googlePlaceId":"","city":"","state":"","zipCode":"","street":"","shortname":"","printableAddress":"","lat":'+str(lat)+',"lng":'+str(lon)+',"subpremise":"","driverInstructions":"","dropoffOptionId":"2","consumerPhoenixExperiments":{"usesCartService":true}},"query":"mutation addConsumerAddress($lat: Float\\u0021, $lng: Float\\u0021, $city: String\\u0021, $state: String\\u0021, $zipCode: String\\u0021, $printableAddress: String\\u0021, $shortname: String\\u0021, $googlePlaceId: String\\u0021, $subpremise: String, $driverInstructions: String, $dropoffOptionId: String, $manualLat: Float, $manualLng: Float, $consumerPhoenixExperiments: ConsumerPhoenixExperiments) { addConsumerAddress(lat: $lat, lng: $lng, city: $city, state: $state, zipCode: $zipCode, printableAddress: $printableAddress, shortname: $shortname, googlePlaceId: $googlePlaceId, subpremise: $subpremise, driverInstructions: $driverInstructions, dropoffOptionId: $dropoffOptionId, manualLat: $manualLat, manualLng: $manualLng, consumerPhoenixExperiments: $consumerPhoenixExperiments) { ...ConsumerFragment __typename }}fragment ConsumerFragment on Consumer { id timezone firstName lastName email phoneNumber receiveTextNotifications defaultCountry isGuest scheduledDeliveryTime socialAccounts accountCredits dropoffOptions { id displayString isDefault isEnabled placeholderText __typename } phoneNumberComponents { formattedNationalNumber nationalNumber formattedInternationalNumber countryCode internationalNumber countryShortname __typename } referrerAmount { unitAmount __typename } defaultAddress { ...DefaultAddressFragment __typename } availableAddresses { id street city subpremise state zipCode lat lng manualLat manualLng shortname printableAddress driverInstructions dropoffPreferences { allPreferences { optionId isDefault instructions __typename } __typename } __typename } defaultAddressDistrict { ...DefaultAddressDistrictFragment __typename } orderCart { ...ConsumerOrderCartFragment __typename } activeSubscription { ...SubscriptionFragment __typename } allSubscriptionPlans { ...ConsumerSubscriptionPlanFragment __typename } __typename}fragment DefaultAddressFragment on DefaultAddress { id street city subpremise state zipCode lat lng manualLat manualLng timezone shortname printableAddress driverInstructions dropoffPreferences { allPreferences { optionId isDefault instructions __typename } __typename } __typename}fragment DefaultAddressDistrictFragment on DefaultAddressDistrict { id name shortname isOpenForAsapDelivery deliveryTimes __typename}fragment ConsumerOrderCartFragment on OrderCart { id hasError isConsumerPickup offersDelivery offersPickup subtotal topOffEnabled urlCode groupCart groupCartPollInterval shortenedUrl maxIndividualCost locked serviceRateMessage isOutsideDeliveryRegion currencyCode menu { id hoursToOrderInAdvance name minOrderSize isBusinessEnabled isCatering __typename } creator { id firstName lastName __typename } deliveries { id quotedDeliveryTime __typename } submittedAt restaurant { id maxOrderSize coverImgUrl slug address { printableAddress street lat lng __typename } business { name __typename } __typename } storeDisclaimers { id disclaimerDetailsLink disclaimerLinkSubstring disclaimerText displayTreatment __typename } orders { ...ConsumerOrdersFragment __typename } topOffItem { orderId item { description price updatedAt id name __typename } topOff { topOffSubtotal topOffTotal taxes orderSubtotal serviceFee minChargeFee serviceFeeMessage __typename } __typename } teamAccount { id name __typename } __typename}fragment ConsumerOrdersFragment on Order { id consumer { firstName lastName id __typename } orderItems { id options { id name __typename } specialInstructions substitutionPreference quantity singlePrice priceOfTotalQuantity item { id name price minAgeRequirement category { title __typename } extras { id title description __typename } __typename } __typename } paymentCard { id stripeId __typename } paymentLineItems { subtotal taxAmount subtotalTaxAmount feesTaxAmount serviceFee __typename } __typename}fragment SubscriptionFragment on Subscription { subscriptionStatus id subscriptionPlan { isPartnerPlan allowAllStores id numEligibleStores __typename } __typename}fragment ConsumerSubscriptionPlanFragment on ConsumerSubscriptionPlan { allowAllStores id numEligibleStores isCorporatePlan __typename}"}'
        data2 = "{\"operationName\":\"storeSearch\",\"variables\":{\"searchLat\":null,\"searchLng\":null,\"offset\":0,\"limit\":" + \
            str(LIMIT) + ",\"searchQuery\":null,\"filterQuery\":null,\"categoryQueryId\":null},\"query\":\"query storeSearch($offset: Int!, $limit: Int!, $order: [String!], $searchQuery: String, $filterQuery: String, $categoryQueryId: ID, $searchLat: Float, $searchLng: Float) {    storeSearch(offset: $offset, limit: $limit, order: $order, searchQuery: $searchQuery, filterQuery: $filterQuery, categoryQueryId: $categoryQueryId, searchLat: $searchLat, searchLng: $searchLng) {    showListAsPickup    numStores    stores {      id      name      description      averageRating      numRatings      numRatingsDisplayString    priceRange      featuredCategoryDescription      deliveryFee      extraSosDeliveryFee      displayDeliveryFee      headerImgUrl      url      isConsumerSubscriptionEligible      distanceFromConsumer      distanceFromConsumerInMeters      distanceFromConsumerString      menus {        popularItems {          imgUrl          __typename        }        __typename      }      merchantPromotions {        id        categoryNewStoreCustomersOnly        deliveryFee        minimumSubtotal        __typename      }      status {        unavailableReason        asapAvailable        scheduledAvailable        asapMinutesRange        asapPickupMinutesRange        __typename      }      location {        lat        lng        __typename      }      badge {        backgroundColor        text        __typename      }      __typename    }    storeItems {      id      name      price      imageUrl      store {        name        url        id        __typename      }      __typename    }    __typename  }}\"}"

        url = "https://www.doordash.com/graphql/"

        session = requests.Session()
        session.headers = headers

        res = session.post(url, data=data)
        searchStore = session.post(url, data=data2).json()
        searchStore = self.search_all_stores(session, searchStore, LIMIT)

        # Get information for feed
        feed_list = []
        stores_data = searchStore['data']['storeSearch']['stores']

        with open('total_feed.json', 'r') as j:
            dictionary = json.loads(j.read())
        if type(dictionary) is dict:
            total = dictionary['data']

        for i in range(len(stores_data)):
            store_data = searchStore['data']['storeSearch']['stores'][i]
            if(store_data['status']['asapAvailable'] == True):
                restaurantId = store_data['id']
                store_name = store_data['name']
                matchingElements = [
                    d for d in total if d.get('name') == store_name]
                if (len(matchingElements)):
                    doordash = matchingElements[0]['data']['platform'][0]['doordash']
                    doordash['support'] = True
                    doordash['id'] = restaurantId
                    # grubhub['deliveryFee'] : depending on whether delivery fee is necessary to the field,
                    # we can get it or not
                    continue
                else:
                    store_img = store_data['headerImgUrl']
                    store_rating = store_data['averageRating']
                    delivery_fee = store_data['deliveryFee']
                    a_dict = {
                        'name': store_name,
                        'data': {
                            'image': store_img,
                            'rating': store_rating,
                            'platform': [{
                                'ubereats': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',
                                },
                                'doordash': {
                                    'support': True,
                                    'id': restaurantId,
                                    'delivery_fee': delivery_fee,

                                },
                                'grubhub': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',

                                },
                            }]
                        }
                    }
                    total.append(a_dict)
        dictionary.update({'data': total})
        #to test the result
        # return json.dumps(dictionary) 
        
        with open('total_feed.json', mode='w') as f:
            f.write(json.dumps(dictionary, indent=2))

        # doordash offer json 
        data3 = '{"operationName":"dealFeed","variables":{"numTopDeals":6,"isFeedServiceMigration":true,"filterQuery":""},"query":"query dealFeed($isFeedServiceMigration: Boolean, $cursor: String, $filterQuery: String, $numTopDeals: Int) {  dealFeed(isFeedServiceMigration: $isFeedServiceMigration, cursor: $cursor, filterQuery: $filterQuery, numTopDeals: $numTopDeals) {    districtIsActive    totalDeals    dealList {      id      type      sortOrder      next {        cursor        __typename      }      data {        id        title        description        carouselStoreOrder        stores {          ... on Deal {            ...DealContentFragment            __typename          }          __typename        }        __typename      }      __typename    }    __typename  }}fragment DealContentFragment on Deal {  id  title  description  type  imageUrl  url  badge {    text    backgroundColor    __typename  }  store {    name    id    isDashpassPartner    averageRating    numRatings    numRatingsDisplayString    status {      asapAvailable      scheduledAvailable      asapMinutesRange      asapPickupMinutesRange      nextOpenTime      __typename    }    __typename  }  __typename}"}'
        offer = session.post(url, data=data3).json()

        dealList = offer['data']['dealFeed']['dealList'][0]['data']['stores']
        dictionary = {
            "totalDeals":offer['data']['dealFeed']['totalDeals'],
            "data": {

             }
        }
        #to check original offer file 
        # with open("offer.json", "w") as outfile:
        #         json.dump(dealList,outfile)

        deal_list = []

        for i in range(len(dealList)):
            restaurantId=dealList[0]['store']['id']
            title=dealList[0]['title']
            description=dealList[0]['description']
            a_dict = {
                'restaurantId':restaurantId,
                'title':title,
                'description':description
            }
            deal_list.append(a_dict)

        dictionary['data']=deal_list
        with open("offer_final.json", "w") as outfile:
                json.dump(dictionary,outfile)
        

    def estimate_service_fee(self, cart_size):  # TODO:
        fee = 0
        return fee


class GrubhubCrawler:

    def __init__(self):
        self.headers = {}
        self.payload = ""
        self.s = requests.Session()

    def create_headers(self):
        self.headers = {
            'content-type': 'application/json;charset=UTF-8'
        }
        self.s.headers.update(self.headers)
        static = 'https://www.grubhub.com/eat/static-content-unauth?contentOnly=1'
        res = self.s.get(static)
        soup = BeautifulSoup(res.text, 'html.parser')

        client = None
        out = None
        try:
            client = re.findall(
                "beta_[a-zA-Z0-9]+", soup.find('script', {'type': 'text/javascript'}).string)
            out = check_output(["curl", "https://api-gtm.grubhub.com/auth", "-H", "content-type: application/json;charset=UTF-8", "--data-binary",
                                "{\"brand\":\"GRUBHUB\",\"client_id\":\"" + client[0] + "\",\"device_id\":-1709487668,\"scope\":\"anonymous\"}", "--compressed"]).decode("utf-8")
        except:
            raise Exception(
                "Grubhub food delivery is not available in your country")

        try:
            access = json.loads(out)['session_handle']['access_token']
        except:
            print(client[0] + "is blocked")

            # # TODO: 너무 자주 try 하면 가끔 curl 했을 때 블락당하는 문제 해결하기. 일단 time.sleep(1)로 해놓으면 해결될 것 같아서 해놨음.
            time.sleep(1)

            out = check_output(["curl", "https://api-gtm.grubhub.com/auth", "-H", "content-type: application/json;charset=UTF-8", "--data-binary",
                                "{\"brand\":\"GRUBHUB\",\"client_id\":\"" + client[0] + "\",\"device_id\":-1709487668,\"scope\":\"anonymous\"}", "--compressed"]).decode("utf-8")
            access = json.loads(out)['session_handle']['access_token']

        # update header with new token
        self.s.headers.update({'authorization': 'Bearer ' + access})

    def get_store(self, restaurantId):
        self.create_headers()
        params = (
            ('hideChoiceCategories', 'true'),
            ('version', '4'),
        )

        response = self.s.get(
            f'https://api-gtm.grubhub.com/restaurants/{restaurantId}', params=params)
        store_json = response.json()
        return store_json

    def get_feed(self, lat, lon):
        self.create_headers()

        # Crawling the first page
        stores = []
        params = (
            ('orderMethod', 'delivery'),
            ('locationMode', 'DELIVERY'),
            ('facetSet', 'umamiV2'),
            ('pageSize', '50'),
            ('hideHateos', 'true'),
            ('searchMetrics', 'true'),
            ('location', f'POINT({lon} {lat})'),
            ('facet', 'open_now:false'),
            ('includeOffers', 'true'),
            ('sortSetId', 'umamiv3'),
            ('sponsoredSize', '0'),
            ('countOmittingTimes', 'true'),
            ('pageNum', '1'),
        )
        response = self.s.get(
            'https://api-gtm.grubhub.com/restaurants/search', params=params)

        # Get the number of total pages
        total_pages = response.json()['search_result']['pager']['total_pages']

        # store the result of the first page
        stores = stores + response.json()['search_result']['results']

        # crawl the rest of the page
        for i in range(2, total_pages+1):
            params = (
                ('orderMethod', 'delivery'),
                ('locationMode', 'DELIVERY'),
                ('facetSet', 'umamiV2'),
                ('pageSize', '50'),
                ('hideHateos', 'true'),
                ('searchMetrics', 'true'),
                ('location', f'POINT({lon} {lat})'),
                ('facet', 'open_now:false'),
                ('includeOffers', 'true'),
                ('sortSetId', 'umamiv3'),
                ('sponsoredSize', '0'),
                ('countOmittingTimes', 'true'),
                ('pageNum', i),
            )
            response = self.s.get(
                'https://api-gtm.grubhub.com/restaurants/search', params=params)
            stores = stores + response.json()['search_result']['results']

        # Get information for feed
        with open('total_feed.json', 'r') as j:
            dictionary = json.loads(j.read())
        if type(dictionary) is dict:
            ubereats = dictionary['data']

        for i in range(len(stores)):
            if(stores[i]['open'] == True):
                restaurantId = stores[i]['restaurant_id']
                store_name = stores[i]['name']
                matchingElements = [
                    d for d in ubereats if d.get('name') == store_name]
                if (len(matchingElements)):
                    grubhub = matchingElements[0]['data']['platform'][0]['grubhub']
                    grubhub['support'] = True
                    grubhub['id'] = restaurantId
                # grubhub['deliveryFee'] : depending on whether delivery fee is necessary to the field,
                # we can get it or not
                    continue
                else:
                    store_img = stores[i]['logo']
                    store_rating = stores[i]['ratings']['rating_value']
                    if (stores[i]['delivery'] == True):
                        delivery_fee = stores[i]['delivery_fee']['price']
                    else:
                        delivery_fee = -1  # when delivery is not available
                    a_dict = {
                        'name': store_name,
                        'data': {
                            'image': store_img,
                            'rating': store_rating,
                            'platform': [{
                                'ubereats': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',
                                },
                                'doordash': {
                                    'support': False,
                                    'id': '',
                                    'delivery_fee': '',
                                },
                                'grubhub': {
                                    'support': True,
                                    'id': restaurantId,
                                    'delivery_fee': delivery_fee,

                                },
                            }]
                        }
                    }
                    ubereats.append(a_dict)
        dictionary.update({'data': ubereats})
        with open('total_feed.json', mode='w') as f:
            f.write(json.dumps(dictionary, indent=2))
        return json.dumps(dictionary)


# dc = UbereatsCrawler()
# ipdb.set_trace()
# keyword = {"address":{"address1":"2268 Bryant St","address2":"San Francisco, CA","aptOrSuite":"","eaterFormattedAddress":"2268 Bryant St, San Francisco, CA 94110, USA","subtitle":"San Francisco, CA","title":"2268 Bryant St","uuid":""},"latitude":37.7582462,"longitude":-122.4096447,"reference":"ChIJt5Ipqzd-j4ARuuhBTqe2MjY","referenceType":"google_places","type":"google_places","source":"manual_auto_complete","addressComponents":{"countryCode":"US","firstLevelSubdivisionCode":"CA","city":"SF","postalCode":"94110"},"originType":"user_autocomplete"}
# keyword = json.dumps(keyword)
# store_info = dc.get_store("f5662d57-747a-428d-b974-d2faaa5bc7ba", keyword)

# dc = DoordashCrawler()
# dc.get_store('171033')
