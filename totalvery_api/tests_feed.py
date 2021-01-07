import ipdb
from django.test import TestCase

import json
import requests

headers = {
    'content-type': 'application/json'
}
payload= {"location":"Tucson"}

res = requests.post("http://127.0.0.1:8000/api/getFeed/",
                    headers=headers, data=payload)

ipdb.set_trace()

print(res.json())
