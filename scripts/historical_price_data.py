"""
    Script responsible for populating the dabatase with historical price data for bitcoin
    and subsequently updating it as needed.
"""

import requests
import json
import datetime
import pymongo
import time
import math

genesis_timestamp = 1231459200 # Timestamp when btc was released

with open('cfg.json') as file:                                                                                                                            
    config = json.load(file)

api_key = config['API_KEY']
mongo_connection_string = config['MONGO_URL']

mongo_client = pymongo.MongoClient(mongo_connection_string)
db = mongo_client["blockchain"]
collection = db["historical_price_data"]

def fetch_price_data(from_timestamp: int, limit=2000):
    url = 'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&toTs=' + str(from_timestamp) + '&limit=' + str(limit) + '&api_key=' + api_key
    r = requests.get(url)
    response = json.loads(r.text)
    print(response)
    return response['Data']['Data']

def populate_price_data():
    url = 'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000&api_key=' + api_key
    r = requests.get(url)
    response = json.loads(r.text)
    historical_price_data = response['Data']['Data']
    last_timestamp =  historical_price_data[0]['time']
    price_data = []

    for day in historical_price_data:
        timestamp = day['time']
        formatted_timestamp = str(datetime.datetime.fromtimestamp(int(timestamp)))[0:10]
        price_data.append(
            {
                "timestamp_unix": timestamp,
                "date": formatted_timestamp,
                "price": day['close']
            }
        )

    while(last_timestamp > genesis_timestamp):
        historical_price_data = fetch_price_data(last_timestamp)
        last_timestamp =  historical_price_data[0]['time']
        for day in historical_price_data:
            timestamp = day['time']
            if (timestamp < genesis_timestamp): 
                break
            formatted_timestamp = str(datetime.datetime.fromtimestamp(int(timestamp)))[0:10]
            price_data.append(
                {
                    "timestamp_unix": timestamp,
                    "date": formatted_timestamp,
                    "price": day['close']
                }
            )

    collection.insert_many(price_data)

def update_price_data():
    query = collection.find({}, {"_id": 0, "timestamp_unix": 1}).sort("timestamp_unix", -1).limit(1)
    latest_price_time = query[0]["timestamp_unix"]
    current_time = math.floor(time.time())
    difference = current_time - latest_price_time
    if(difference > 86400):
        days_behind = math.floor(difference / 86400)
        historical_price_data = fetch_price_data(query[0]["timestamp_unix"], days_behind)
        for day in historical_price_data:
            print(day)
    else:
        print(math.floor(difference / 86400))

#update_price_data()
#populate_price_data()




