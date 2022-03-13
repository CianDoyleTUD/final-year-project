import pymongo
import datetime
import json

mongoclient = pymongo.MongoClient("mongodb://localhost:27017/")
database = mongoclient["blockchain"]

def find_transactions(date, timestamp=False):
    aggregate_transaction_value = 0
    transaction_count = 0
    
    if timestamp:
        date_formatted = datetime.datetime.utcfromtimestamp(date).strftime('%Y-%m-%d')
    else:
        date_formatted = date
        date = datetime.datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=datetime.timezone.utc).timestamp()

    results = database["blocks_full"].find({ "time": {"$gte": date, "$lte": date+86400} }, {"_id": 0, "tx": 1})
    for block in results:
        for tx in block['tx']:
            transaction_count += 1
            for output in tx['outputs']:
                aggregate_transaction_value += output['value']

    return {
        "timestamp_unix": date,
        "date": date_formatted,
        "transaction_count": transaction_count,
        "aggregate_transaction_value": aggregate_transaction_value
    }

def upload_transaction_stats(time_from, time_to):
    current_time = datetime.datetime.strptime(time_from, "%Y-%m-%d").replace(tzinfo=datetime.timezone.utc).timestamp()
    end_time = datetime.datetime.strptime(time_to, "%Y-%m-%d").replace(tzinfo=datetime.timezone.utc).timestamp()
    while current_time <= end_time:
        transaction_data = find_transactions(current_time, timestamp=True)
        database["transactions_24h"].insert_one(transaction_data)
        date = datetime.datetime.utcfromtimestamp(current_time).strftime('%Y-%m-%d')
        print("Collected data for " + date)
        current_time += 86400

#upload_transaction_stats("2009-01-06", "2022-03-11")