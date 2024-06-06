import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1.js'
import {
    toHex,
    hexToBytes,
    utf8ToBytes,
    bytesToUtf8,
    bytesToHex,
} from 'ethereum-cryptography/utils'
import { getAddress, hashMessage, signMessage } from './lib/utils.js'
import crypto from 'crypto'

const privateKey = secp.utils.randomPrivateKey()
const publicKey = secp.getPublicKey(privateKey)
const pvtKHex = bytesToHex(publicKey)
console.log('Public key: ' + pvtKHex)
console.log('Private key: ' + bytesToHex(privateKey))
console.log('Address: 0x' + getAddress(toHex(publicKey)))
