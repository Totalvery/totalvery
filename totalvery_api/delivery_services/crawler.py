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

    def estimate_service_fee(self, cart_size): # TODO: implement to crawl getOrderEstimateV1
        fee = 0
        return fee


class DoordashCrawler:

    def __init__(self):
        self.headers = {}
        self.payload = ""

    def create_headers(self):
        pass

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

    def estimate_service_fee(self, cart_size): # TODO: 
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

        try:
            client = re.findall(
                "beta_[a-zA-Z0-9]+", soup.find('script', {'type': 'text/javascript'}).string)
        except:
            print("Grubhub food delivery is not available in your country")

        out = check_output(["curl", "https://api-gtm.grubhub.com/auth", "-H", "content-type: application/json;charset=UTF-8", "--data-binary",
                            "{\"brand\":\"GRUBHUB\",\"client_id\":\"" + client[0] + "\",\"device_id\":-1709487668,\"scope\":\"anonymous\"}", "--compressed"]).decode("utf-8")
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


# gc = UbereatsCrawler()
# import ipdb; ipdb.set_trace()
# res = gc.get_store('65f472f1-5f54-4429-8956-0774ffee6cdd')
