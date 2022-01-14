import cx_Oracle
import requests
import json

query_headers = {'content-type': 'text/plain'}

rpc_user = 'admin'
rpc_password = 'admin'
rpc_ip = 'http://localhost:8332/'
db_user=""
db_password=""
db_dsn=""

cx_Oracle.init_oracle_client(lib_dir=r"C:\Users\ciand\Documents\instantclient-basic-windows.x64-21.3.0.0.0\instantclient_21_3")

def gettransaction(tx_hash, block_hash=''):

    params = [tx_hash, True]

    if block_hash:
        params.append(block_hash)

    query_data = json.dumps({
        'method' : 'getrawtransaction',
        'params' : params
    })

    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), data = query_data, headers = query_headers)
        return r.json()['result']
    except:
        print('An error occured when trying to query the transaction')


def getblock(block_hash, verbosity=1):

    params = [block_hash]

    if verbosity != 1: 
        params.append(verbosity)

    query_data = json.dumps({
        'method' : 'getblock',
        'params' : params
    })

    try:
        r = requests.post(rpc_ip, auth=(rpc_user, rpc_password), data = query_data, headers = query_headers)
        return r.json()['result']
    except:
        print('An error occured when trying to send GET request')

def insert_block(hash : str, confirmations: int, strippedsize: int, blocksize: int, weight: int, height: int, version: int, versionHex: str,
                    merkleRoot: str, time: int, mediantime: int, nonce: int, bits: str, difficulty: int, chainwork: str, ntx: int, previousblockhash: str, nextblockhash=""):
    sql = ('insert into blockchain.block ' 
    'values(:hash, :confirmations, :strippedsize, :blocksize, :weight, :height, :version, :versionHex, :merkleRoot, :time, :mediantime, :nonce, :bits, :difficulty, :chainwork, :ntx, :previousblockhash, :nextblockhash)')
    try:
        with cx_Oracle.connect(user=db_user, password=db_password, dsn=db_dsn) as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql, [hash, confirmations, strippedsize, blocksize, weight, height, version, 
                    versionHex, merkleRoot, time, mediantime, nonce, bits, difficulty, chainwork, ntx, previousblockhash, nextblockhash])
                connection.commit()
    except cx_Oracle.Error as error:
        print(error)
