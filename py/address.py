import hashlib
import base58
from bip32utils import Base58 as bip32
 
def encrypt_sha256(hash_string):
    hash_string = bytes.fromhex(hash_string)
    sha_signature = \
        hashlib.sha256(hash_string).hexdigest()
    return sha_signature

def encrypt_ripemd160(hash_string):
    ripemd_signature = \
        hashlib.ripemd160(hash_string).hexdigest()
    return ripemd_signature

def hash160(x): 
    return hashlib.new('ripemd160', hashlib.sha256(x).digest()).digest()

def p2pkh_pubkey_to_address(pubkey: str, segwit=False) -> str:
    sha256_signature = encrypt_sha256(pubkey)
    ripemd_signature = hashlib.new('ripemd160', bytes.fromhex(sha256_signature)).hexdigest()
    ripemd_signature = '00' + ripemd_signature
    sha256_signature = encrypt_sha256(ripemd_signature)
    sha256_signature = encrypt_sha256(sha256_signature)
    checksum = sha256_signature[0:8]
    ripemd_signature = ripemd_signature + checksum
    if (segwit):
        script_sig = bytes.fromhex("0014") + hash160(bytes.fromhex(pubkey))
        address = bip32.check_encode(b"\x05" + hash160(script_sig))
        return address
    else:
        return base58.b58encode(bytes.fromhex(ripemd_signature)).decode('utf-8')