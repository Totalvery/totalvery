import requests
from bs4 import BeautifulSoup
import re
import json

from subprocess import check_output
import time


class UbereatsCrawler:

    def __init__(self):
        self.headers = {}
        self.payload = ""
        self.s = requests.Session()

    def create_headers(self):
        pass

    def get_store(self, restaurantId):
        headers = {
            'x-csrf-token': 'x',
            'content-type': 'application/json',
            'accept': '*/*'
        }
        data = '{"storeUuid":"'+restaurantId+'"}'

        response = requests.post(
            'https://www.ubereats.com/api/getStoreV1', headers=headers, data=data)
        store_json = response.json()
        return store_json

    def get_feed(self, location):
        headers = {"x-csrf-token": "x"}
        dataForm = {'query': location}
        s = requests.Session()
        response = s.post(
            "https://www.ubereats.com/api/getLocationAutocompleteV1", data=dataForm, headers=headers)
        location_json = response.json()['data'][0]

        response = s.post(
            'https://www.ubereats.com/api/getLocationDetailsV1', headers=headers, data=location_json)
        location_json = response.json()['data']
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
                'https://www.ubereats.com/api/getFeedV1', headers=headers, data=data)

            feed_json = response.json()['data']
            stores = feed_json['storesMap']
            meta = feed_json['meta']
            dict_stores.update(stores)

            if meta['hasMore']:
                offset = meta['offset']
            else:
                break

        feed_list = []
        for key in dict_stores.keys():
            if(dict_stores[key]['isOpen'] == True):
                restaurantId = key
                store_name = dict_stores[key]['title']
                store_img = dict_stores[key]['heroImageUrl']
                if(dict_stores[key]['feedback'] != None):
                    store_rating = dict_stores[key]['feedback']['rating']
                if(dict_stores[key]['meta']['deliveryFee'] != None):
                    delivery_fee = dict_stores[key]['meta']['deliveryFee']['text']

                a_dict = {'name': store_name,
                          'img': store_img, 'rating': store_rating, 'delivery_fee': delivery_fee}

                feed_list.append(a_dict)

        return json.dumps(feed_list, indent=2)

    # TODO: implement to crawl getOrderEstimateV1
    def estimate_service_fee(self, cart_size):
        fee = 0
        return fee


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
                    'https://www.doordash.com/graphql', data=data2).json()['data']['storeSearch']['stores']
                searchStore['data']['storeSearch']['stores'] += stores
        return searchStore

    def get_store(self, restaurantId):
        url = "https://www.doordash.com/graphql"
        if len(self.headers) == 0:
            headers = {
                'content-type': "application/json"
            }

        self.payload = "{\"operationName\":\"storepageFeed\",\"variables\":{\"fulfillmentType\":\"Delivery\",\"storeId\":" + str(restaurantId) + ",\"isMerchantPreview\":false,\"isStorePageFeedMigration\":true,\"includeDifferentialPricingEnabled\":true},\"query\":\"query storepageFeed($storeId: ID\\u0021, $menuId: ID, $isMerchantPreview: Boolean, $fulfillmentType: FulfillmentType, $includeDifferentialPricingEnabled: Boolean\\u0021) {  storepageFeed(isStorePageFeedMigration: true, storeId: $storeId, menuId: $menuId, isMerchantPreview: $isMerchantPreview, fulfillmentType: $fulfillmentType) {    storeHeader {      id      name      description      priceRange      offersDelivery      offersPickup      offersGroupOrder      isConvenience      isDashpassPartner      address {        city        street        displayAddress        cityLink        __typename      }      business {        id        name        link        ... @include(if: $includeDifferentialPricingEnabled) {          differentialPricingEnabled          __typename        }        __typename      }      businessTags {        name        link        __typename      }      deliveryFeeLayout {        title        subtitle        isSurging        displayDeliveryFee        __typename      }      deliveryFeeTooltip {        title        description        __typename      }      coverImgUrl      coverSquareImgUrl      businessHeaderImgUrl      ratings {        numRatings        numRatingsDisplayString        averageRating        isNewlyAdded        __typename      }      distanceFromConsumer {        value        label        __typename      }      enableSwitchToPickup      asapStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      asapPickupStatus {        unavailableStatus        displayUnavailableStatus        unavailableReason        displayUnavailableReason {          title          subtitle          __typename        }        isAvailable        unavailableReasonKeysList        __typename      }      status {        delivery {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isTooFarFromConsumer          isStoreInactive          __typename        }        pickup {          isAvailable          minutes          displayUnavailableStatus          unavailableReason          isStoreInactive          __typename        }        __typename      }      __typename    }    banners {      pickup {        id        title        text        __typename      }      catering {        id        text        __typename      }      demandGen {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      demandTest {        id        title        text        modals {          type          modalKey          modalInfo {            title            description            buttonsList {              text              action              __typename            }            __typename          }          __typename        }        __typename      }      __typename    }    carousels {      id      type      name      description      items {        id        name        description        displayPrice        imgUrl        calloutDisplayString        nextCursor        orderItemId        reorderCartId        reorderUuid        unitAmount        currency        __typename      }      __typename    }    menuBook {      id      name      displayOpenHours      menuCategories {        id        name        numItems        next {          anchor          cursor          __typename        }        __typename      }      menuList {        id        name        displayOpenHours        __typename      }      __typename    }    itemLists {      id      name      description      items {        id        name        description        displayPrice        imageUrl        calloutDisplayString        __typename      }      __typename    }    disclaimersList {      id      text      __typename    }    __typename  }}\"}"
        response = requests.request(
            "POST", url, data=self.payload, headers=headers)
        store_json = response.json()
        return store_json

    def get_feed(self, location):
        LIMIT = 200  # max num of searchStores
        assert LIMIT <= 200, "the maximum of limit is 200"
        headers = {"x-csrf-token": "x"}
        dataForm = {'query': location}

        s = requests.Session()
        response = s.post(
            "https://www.ubereats.com/api/getLocationAutocompleteV1", data=dataForm, headers=headers)
        # TODO: 지금은 임의로 0으로 해놨지만 나중엔 client가 선택할 수 있게
        location_json = response.json()['data'][0]
        response = s.post(
            'https://www.ubereats.com/api/getLocationDetailsV1', headers=headers, data=location_json)
        location_json = response.json()['data']

        googlePlaceId = location_json['reference']
        city = location_json['addressComponents']['city']
        state = location_json['addressComponents']['firstLevelSubdivisionCode']
        printableAddress = location_json['address']['eaterFormattedAddress']
        latitude = location_json['latitude']
        longitude = location_json['longitude']
        zipcode = location_json['addressComponents']['postalCode']
        shortname = location_json['address']['title']

        headers = {
            'content-type': 'application/json',
        }

        data = '{"operationName":"addConsumerAddress","variables":{"googlePlaceId":"'+googlePlaceId+'","city":"'+city+'","state":"'+state+'","zipCode":"'+zipcode+'","street":"","shortname":"","printableAddress":"'+printableAddress+'","lat":'+str(latitude)+',"lng":'+str(longitude)+',"subpremise":"","driverInstructions":"","dropoffOptionId":"2","consumerPhoenixExperiments":{"usesCartService":true}},"query":"mutation addConsumerAddress($lat: Float\\u0021, $lng: Float\\u0021, $city: String\\u0021, $state: String\\u0021, $zipCode: String\\u0021, $printableAddress: String\\u0021, $shortname: String\\u0021, $googlePlaceId: String\\u0021, $subpremise: String, $driverInstructions: String, $dropoffOptionId: String, $manualLat: Float, $manualLng: Float, $consumerPhoenixExperiments: ConsumerPhoenixExperiments) { addConsumerAddress(lat: $lat, lng: $lng, city: $city, state: $state, zipCode: $zipCode, printableAddress: $printableAddress, shortname: $shortname, googlePlaceId: $googlePlaceId, subpremise: $subpremise, driverInstructions: $driverInstructions, dropoffOptionId: $dropoffOptionId, manualLat: $manualLat, manualLng: $manualLng, consumerPhoenixExperiments: $consumerPhoenixExperiments) { ...ConsumerFragment __typename }}fragment ConsumerFragment on Consumer { id timezone firstName lastName email phoneNumber receiveTextNotifications defaultCountry isGuest scheduledDeliveryTime socialAccounts accountCredits dropoffOptions { id displayString isDefault isEnabled placeholderText __typename } phoneNumberComponents { formattedNationalNumber nationalNumber formattedInternationalNumber countryCode internationalNumber countryShortname __typename } referrerAmount { unitAmount __typename } defaultAddress { ...DefaultAddressFragment __typename } availableAddresses { id street city subpremise state zipCode lat lng manualLat manualLng shortname printableAddress driverInstructions dropoffPreferences { allPreferences { optionId isDefault instructions __typename } __typename } __typename } defaultAddressDistrict { ...DefaultAddressDistrictFragment __typename } orderCart { ...ConsumerOrderCartFragment __typename } activeSubscription { ...SubscriptionFragment __typename } allSubscriptionPlans { ...ConsumerSubscriptionPlanFragment __typename } __typename}fragment DefaultAddressFragment on DefaultAddress { id street city subpremise state zipCode lat lng manualLat manualLng timezone shortname printableAddress driverInstructions dropoffPreferences { allPreferences { optionId isDefault instructions __typename } __typename } __typename}fragment DefaultAddressDistrictFragment on DefaultAddressDistrict { id name shortname isOpenForAsapDelivery deliveryTimes __typename}fragment ConsumerOrderCartFragment on OrderCart { id hasError isConsumerPickup offersDelivery offersPickup subtotal topOffEnabled urlCode groupCart groupCartPollInterval shortenedUrl maxIndividualCost locked serviceRateMessage isOutsideDeliveryRegion currencyCode menu { id hoursToOrderInAdvance name minOrderSize isBusinessEnabled isCatering __typename } creator { id firstName lastName __typename } deliveries { id quotedDeliveryTime __typename } submittedAt restaurant { id maxOrderSize coverImgUrl slug address { printableAddress street lat lng __typename } business { name __typename } __typename } storeDisclaimers { id disclaimerDetailsLink disclaimerLinkSubstring disclaimerText displayTreatment __typename } orders { ...ConsumerOrdersFragment __typename } topOffItem { orderId item { description price updatedAt id name __typename } topOff { topOffSubtotal topOffTotal taxes orderSubtotal serviceFee minChargeFee serviceFeeMessage __typename } __typename } teamAccount { id name __typename } __typename}fragment ConsumerOrdersFragment on Order { id consumer { firstName lastName id __typename } orderItems { id options { id name __typename } specialInstructions substitutionPreference quantity singlePrice priceOfTotalQuantity item { id name price minAgeRequirement category { title __typename } extras { id title description __typename } __typename } __typename } paymentCard { id stripeId __typename } paymentLineItems { subtotal taxAmount subtotalTaxAmount feesTaxAmount serviceFee __typename } __typename}fragment SubscriptionFragment on Subscription { subscriptionStatus id subscriptionPlan { isPartnerPlan allowAllStores id numEligibleStores __typename } __typename}fragment ConsumerSubscriptionPlanFragment on ConsumerSubscriptionPlan { allowAllStores id numEligibleStores isCorporatePlan __typename}"}'
        data2 = "{\"operationName\":\"storeSearch\",\"variables\":{\"searchLat\":null,\"searchLng\":null,\"offset\":0,\"limit\":" + \
            str(LIMIT) + ",\"searchQuery\":null,\"filterQuery\":null,\"categoryQueryId\":null},\"query\":\"query storeSearch($offset: Int!, $limit: Int!, $order: [String!], $searchQuery: String, $filterQuery: String, $categoryQueryId: ID, $searchLat: Float, $searchLng: Float) {    storeSearch(offset: $offset, limit: $limit, order: $order, searchQuery: $searchQuery, filterQuery: $filterQuery, categoryQueryId: $categoryQueryId, searchLat: $searchLat, searchLng: $searchLng) {    showListAsPickup    numStores    stores {      id      name      description      averageRating      numRatings      numRatingsDisplayString    priceRange      featuredCategoryDescription      deliveryFee      extraSosDeliveryFee      displayDeliveryFee      headerImgUrl      url      isConsumerSubscriptionEligible      distanceFromConsumer      distanceFromConsumerInMeters      distanceFromConsumerString      menus {        popularItems {          imgUrl          __typename        }        __typename      }      merchantPromotions {        id        categoryNewStoreCustomersOnly        deliveryFee        minimumSubtotal        __typename      }      status {        unavailableReason        asapAvailable        scheduledAvailable        asapMinutesRange        asapPickupMinutesRange        __typename      }      location {        lat        lng        __typename      }      badge {        backgroundColor        text        __typename      }      __typename    }    storeItems {      id      name      price      imageUrl      store {        name        url        id        __typename      }      __typename    }    __typename  }}\"}"

        url = "https://www.doordash.com/graphql"

        session = requests.Session()
        session.headers = headers

        res = session.post(url, data=data)
        searchStore = session.post(url, data=data2).json()
        searchStore = self.search_all_stores(session, searchStore, LIMIT)

        # Get information for feed
        feed_list = []
        stores_data = searchStore['data']['storeSearch']['stores']

        for i in range(len(stores_data)):
            store_data = searchStore['data']['storeSearch']['stores'][i]
            if(store_data['status']['asapAvailable'] == True):
                restaurantId = store_data['id']
                store_name = store_data['name']
                store_img = store_data['headerImgUrl']
                store_rating = store_data['averageRating']
                delivery_fee = store_data['deliveryFee']

                a_dict = {'name': store_name,  'img': store_img,
                          'rating': store_rating, 'delivery_fee': delivery_fee}
                feed_list.append(a_dict)
        return json.dumps(feed_list, indent=2)

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
            raise Exception("Grubhub food delivery is not available in your country")
        
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

    def get_feed(self, location):
        self.create_headers()
        params = (
            ('queryText', location),
        )

        response = self.s.get(
            'https://api-gtm.grubhub.com/geocode/autocomplete', params=params)
        params = (
            ('address', response.json()[0]),
        )
        response = self.s.get(
            'https://api-gtm.grubhub.com/geocode', params=params)
        locality = response.json()[0]['location_address']['locality']
        administrative_area = response.json(
        )[0]['location_address']['administrative_area']
        lat = response.json()[0]['latitude']
        lon = response.json()[0]['longitude']

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
        feed_list = []
        for i in range(len(stores)):
            if(stores[i]['open'] == True):
                restaurantId = stores[i]['restaurant_id']
                store_name = stores[i]['name']
                store_img = stores[i]['logo']
                store_rating = stores[i]['ratings']['rating_value']
                delivery_fee = stores[i]['delivery_fee']['price']

                a_dict = {'name': store_name,
                          'img': store_img, 'rating': store_rating, 'delivery_fee': delivery_fee}

                feed_list.append(a_dict)

        return json.dumps(feed_list, indent=2)
