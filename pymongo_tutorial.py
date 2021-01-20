import pymongo
from pymongo import MongoClient
cluster = MongoClient("mongodb+srv://totalvery:1111@cluster0.qpazd.mongodb.net/totalvery?retryWrites=true&w=majority")
db = cluster["totalvery"]
collection = db["totalvery"] #mini database 
post = {"_id":0,"name":"test","location":"seoul"} # we need _id 
#collection.insert_one(post)

#query 
results = collection.find({"name":"test"})
#search for one result
#result = collection.find_one({"_id":0})
for result in results:
    print(result)
    #print(result["_id"]) #access the id field