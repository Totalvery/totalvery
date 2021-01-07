import ipdb
from django.test import TestCase

import json
import requests

headers = {
    'content-type': 'application/json'
}

# TODO: cart size도 넘겨주기
payload = json.dumps({"meta": {"ubereats": True, "doordash": True, "grubhub": True}, "ids": {
                     "ubereatsID": "65f472f1-5f54-4429-8956-0774ffee6cdd", "doordashID": "540546", "grubhubID": "332063"}})

res = requests.post("http://127.0.0.1:8000/api/getStoreDetails/",
                    headers=headers, data=payload)

ipdb.set_trace()

dic = res.json()
