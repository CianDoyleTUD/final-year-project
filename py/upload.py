import json 
import requests 
import time
import math
import pymongo
import asyncio
from threading import Thread
import sys
from address import p2pkh_pubkey_to_address

query_headers = {'content-type': 'text/plain'}

rpc_user = 'admin'
rpc_password = 'admin'
rpc_ip = 'http://localhost:8332/'

mongoclient = pymongo.MongoClient("mongodb://localhost:27017/")
database = mongoclient["blockchain"]

genesis_hash = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"

def decodescript(script):
    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), json={"method" : "decodescript", "params" : [script]}, headers = query_headers)
        json_result = r.json()
        return json_result['result']['p2sh']
    except KeyError as e:
        print(e)
        
def gettransaction(tx_hash, block_hash=''):

    params = [tx_hash, True]

    if block_hash:
        params.append(block_hash)

    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), json={"method" : "getrawtransaction", "params" : params}, headers = query_headers)
        json_result = r.json()
        return json_result['result']
    except KeyError as e:
        print(e)
        sys.exit()

def gettransactions(tx_hashes): # Optimised POST request for getting multiple transactions in a batch request

    tx_requests = []
    for hash in tx_hashes:
        req = {
            "method": "getrawtransaction",
            "params" :  [hash, True]
        }
        tx_requests.append(req)
    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), json=tx_requests, headers = query_headers)
        json_result = r.json()
        return json_result
    except KeyError as e:
        print(e)
        sys.exit()

rpc_user = 'admin'
rpc_password = 'admin'
rpc_ip = 'http://localhost:8332/'

def getblock(block_hash, verbosity=1):

    params = [block_hash]

    if verbosity != 1: 
        params.append(verbosity)

    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), json={"method" : "getblock", "params" : params}, headers = query_headers, verify=False)
        json_result = r.json()
        return json_result['result']
    except KeyError as e:
        print(e)
        sys.exit()

print("Reading last saved block...\n")

# Gets the address from a transaction output
def address_from_output(output):
    output_type = output['scriptPubKey']['type']
    if (output_type == 'nonstandard'):
        return "0xDEADBEEF"
    elif(output_type == 'pubkey'):
        public_key = output['scriptPubKey']['asm'].split(' ')[0]
        return p2pkh_pubkey_to_address(public_key)
    else:   
        if 'address' in output['scriptPubKey']:
            return output['scriptPubKey']['address']
        else:
            return output['scriptPubKey']['addresses'][0]

# Parses transaction outputs and inputs and returns formatted transaction JSON object
def parse_transaction_outputs(transaction, timestamp='', type='regular', max_inputs=10):
    transaction_inputs = []
    transaction_outputs = []
    utxo_ids = []
    utxo_vouts = []

    if('time' in transaction):
        tstamp = transaction['time']                                        
    else:
        tstamp = timestamp
    
    # Handle UTXO inputs
    if (type == 'regular'): 
        inputs = transaction['vin']
        input_count = len(inputs)

        if(max_inputs > 1): 
            for i in range(0, input_count): # Append UTXOs to array to be fetched
                if(i > max_inputs):
                    break
                utxo_ids.append(inputs[i]['txid'])
                utxo_vouts.append(inputs[i]['vout'])
            # Fetch UTXO origins
            utxos = gettransactions(utxo_ids) 
            for i in range(0, len(utxos)):
                output = utxos[i]['result']['vout'][utxo_vouts[i]]
                input_formatted = {
                    "from": address_from_output(output),
                    "value": output['value']
                }
                transaction_inputs.append(input_formatted)
        else: 
            utxo_txid = inputs[0]['txid']
            utxo_index = inputs[0]['vout']
            utxo = gettransaction(utxo_txid)['vout'][utxo_index]
            
            input_formatted = {
                "from": address_from_output(utxo),
                "value": utxo['value']
            }
            transaction_inputs.append(input_formatted)


    # Format output data 
    for output in transaction['vout']:
        output_type = output['scriptPubKey']['type']
        if (output_type == 'nulldata'):
            break
        else:
            address = address_from_output(output)
            transaction_output = {
                "to": address,
                "value": output['value']
            }
        transaction_outputs.append(transaction_output)
    # Return formatted data
    if (type == 'coinbase'): 
        return {
            "txid": transaction['txid'],
            "time": tstamp,
            "coinbase": transaction['vin'][0]['coinbase'],
            "sequence": transaction['vin'][0]['sequence'],
            "outputs": transaction_outputs,
        }
    else:
        return {
            "txid": transaction['txid'],
            "time": tstamp,
            "inputs": transaction_inputs,
            "outputs": transaction_outputs
        }    

# Iterate through transactions in block
def parse_transactions(block, transaction_limit=False, limit=0):

    transactions = []

    # Coinbase transaction
    coinbase_transaction_formatted = parse_transaction_outputs(block['tx'][0], timestamp=block['time'], type='coinbase')
    transactions.append(coinbase_transaction_formatted)

    # Non coinbase transactions
    for i in range(1, block['nTx']):
        if(transaction_limit and i > limit):
            break
        transaction_formatted = parse_transaction_outputs(block['tx'][i], timestamp=block['time'])
        transactions.append(transaction_formatted)

    return transactions

# Uploads blocks to mongodb 
async def upload_data(collection, data):
    collection = database[collection]
    x = collection.insert_many(data)

async def upload_blocks_with_txs(starting_block_hash: str, end_block: int, chunk_size: int):
    array_size = chunk_size 
    blocks = [] # Temporary array for holding block data

    # Fetch and process block data
    current_block = getblock(starting_block_hash, 2)
    parsed_transactions = parse_transactions(current_block)
    current_block['tx'] = parsed_transactions
    #await notify_users(parsed_transactions)
    blocks.append(current_block)

    # While there are blocks left
    while('nextblockhash' in current_block and current_block['height'] < end_block):
        # Fetch and process next block data
        current_block = getblock(current_block['nextblockhash'], 2) 
        current_block['tx'] = parse_transactions(current_block)
        blocks.append(current_block)
        # If chunk size is reached
        if(current_block['height'] % array_size == 0):
            print("Uploading latest " + str(array_size) + " blocks (#" + str(current_block['height']) + ")\n")
            # Upload data to database
            await upload_data('blocks_full', blocks)
            print("Upload complete @ " + time.ctime())
            blocks = [] # Reset temporary block array

            if(current_block['height'] == 100000):
                array_size = 1000
            elif(current_block['height'] == 200000):
                array_size = 500
            elif (current_block['height'] == 300000):
                array_size = 100

# Checks a transaction array and checks all transactions. If the transaction contains a wallet which is being tracked by a user, it will add the txid to the database
async def notify_users(parsed_transactions):
    tracked_wallets_collection = database["tracked_wallets"]
    notifications_list = [] # List of users to be notified along with transactions data
    for tx in parsed_transactions:
        print("Checking transaction: " + tx['txid'])
        # Check inputs
        if 'coinbase' not in tx:
            for input in tx['inputs']:
                results = tracked_wallets_collection.find( {"tracked_wallets.wallet": input['from']} )
                users_to_notify = list(results)
                for user in users_to_notify:
                    notifications_list.append({"username": user.username, "txid": tx['txid'], "timestamp": tx['time'], "read": False})
        #Check outputs
        for output in tx['outputs']:
            results = tracked_wallets_collection.find( {"tracked_wallets.wallet": output['to']} )
            users_to_notify = list(results)
            for user in users_to_notify:
                notifications_list.append({"username": user.username, "txid": tx['txid'], "timestamp": tx['time'], "read": False})
    # Add notification data to database
    for user in notifications_list:
        results = tracked_wallets_collection.update_one( {"username": user['username'] }, {'$push': {'notifications': {"txid": user['txid'], "timestamp": user['timestamp'], "read": user['read']}} }, upsert = True )

        

