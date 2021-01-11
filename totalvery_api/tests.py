import ipdb
from django.test import TestCase

import json
import requests

headers = {
    'content-type': 'application/json'
}

# TODO: cart size도 넘겨주기
payload = json.dumps({"meta": {"ubereats": True, "doordash": False, "grubhub": True}, "ids": {"ubereatsID": "ad169977-8618-4736-8d27-5cf1e9969658", "doordashID": "0", "grubhubID": "1188511"}, "customer_location": {"latitude": 32.2250168,
                                                                                                           "longitude": -110.9539833}})

res = requests.post("http://127.0.0.1:8000/api/getStoreDetails/",
                    headers=headers, data=payload)

ipdb.set_trace()

dic = res.json()


# from totalvery_api.delivery_services.crawler import UbereatsCrawler, DoordashCrawler, GrubhubCrawler


# uc = GrubhubCrawler()
# dummy = uc.get_store("332063")
# import ipdb; ipdb.set_trace()
