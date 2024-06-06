import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex, utf8ToBytes, hexToBytes } from 'ethereum-cryptography/utils'

/**
 * @returns <Uint8Array>
 */
export function hashMessage(msg) {
    return keccak256(utf8ToBytes(msg))
}

/**
 * @param {string} msgHashHex Hashed message as hex string
 * @param {string} privateKey Private key as hex string
 */
export function signMessage(msgHashHex, privateKey) {
    return secp.sign(msgHashHex, hexToBytes(privateKey))
}

export async function recoveryPublicKey(message, signature, recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit)
}

/**
 * Note: publicKey's first byte contains information about the type, wether it's compressed or not
 * so, we have to ignore the first byte.
 * @param {string} publicKey  Public key as a hex string
 * @returns {string} address as hex string
 */
export function getAddress(publicKey) {
    return toHex(keccak256(utf8ToBytes(publicKey).slice(1)).slice(-20))
}

export function getAddressFromBytes(publicKey) {
    return toHex(keccak256(utf8ToBytes(publicKey).slice(1)).slice(-20))
}
