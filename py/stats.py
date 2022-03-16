import pymongo
import datetime
import json
import time

mongoclient = pymongo.MongoClient("mongodb://localhost:27017/")
database = mongoclient["blockchain"]

def upload_transactions_24h(date, timestamp=False):
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
        transaction_data = upload_transactions_24h(current_time, timestamp=True)
        database["transactions_24h"].insert_one(transaction_data)
        date = datetime.datetime.utcfromtimestamp(current_time).strftime('%Y-%m-%d')
        print("Collected data for " + date)
        current_time += 86400

def update_transaction_stats(date):
    aggregate_transaction_value = 0
    transaction_count = 0
    time_now = time.time()
    query = database["transactions_24h"].find_one({ "date": date }, {"_id": 0, "last_time": 1})

    if(query is None): # New day
        time_since_midnight = time_now % 86400
        print("New day " + str(time_since_midnight) + " seconds since midnight")
        results = database["blocks_full"].find({ "time": {"$gte": time_now-time_since_midnight, "$lte": time_now} }, {"_id": 0, "tx": 1})
        block_time = 0

        for block in results:
            block_time = block['time']
            print(block['hash'])
            for tx in block['tx']:
                transaction_count += 1
                for output in tx['outputs']:
                    aggregate_transaction_value += output['value']

        database["transactions_24h"].insert_one({
            "timestamp_unix": date,
            "date": date_formatted,
            "transaction_count": transaction_count,
            "aggregate_transaction_value": aggregate_transaction_value,
            "last_time": block_time
        })
    else:
        print("Updating day " + str(date))
        last_time = query[0]['last_time']
        results = database["blocks_full"].find({ "time": {"$gt": time, "$lte": time_now} }, {"_id": 0, "tx": 1})
        block_time = 0

        for block in results:
            block_time = block['time']
            for tx in block['tx']:
                transaction_count += 1
                for output in tx['outputs']:
                    aggregate_transaction_value += output['value']

        database["transactions_24h"].update_one({ "date": date }, { "$inc": { "aggregate_transaction_value": aggregate_transaction_value, "transaction_count": transaction_count } })

        

# Estimate the hash rate in the past X hours
# Hash Rate:
#   (((Blocks Found / Blocks Expected) * (Difficulty * 2^32)) / 600) 
#   OR 
#   (2^32 * (Difficulty / Time between blocks))

def get_hash_rate(period_hours):

    time_now = 1377760020
    #time_now = time.time()
    blocks_expected = period_hours * 6 # Block expected every 10 mins

    results = database["blocks_full"].find({ "time": {"$gte": time_now - (period_hours * 3600), "$lte": time_now} }, {"_id": 0, "difficulty": 1, "time": 1}).sort("time", -1)

    block_list = list(results)
    blocks_found = len(block_list)
    block_difficulty = block_list[0]['difficulty']

    total_block_time = 0

    for i in range(0, len(block_list)):
        if(i > 0):
            total_block_time += (block_list[i-1]['time'] - block_list[i]['time'] )

    average_block_time = total_block_time / blocks_found

    hash_rate_ths = (2**32 * (block_difficulty / average_block_time)) / 1e12 # (blocks_found / blocks_expected) * (block_difficulty * 2**32) / 600 / 1e12 
    hash_rate_formatted = '{:f}'.format(hash_rate_ths)

    return hash_rate_formatted

hash_rate = get_hash_rate(24)
print(hash_rate)
#update_transaction_stats("2022-03-15")
#upload_transaction_stats("2009-01-06", "2022-03-11")