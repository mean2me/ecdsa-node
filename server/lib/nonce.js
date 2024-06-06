import cache from 'memory-cache'

/**
 * @param {string} nonce
 */
export function burnNonce(nonce) {
    const nonces = cache.get('nonces') || []
    cache.put('nonces', [...nonces, `${nonce}`])
}

export function isValidateNonce(nonce) {
    const nonces = cache.get('nonces') || []
    return nonces.indexOf(`${nonce}`) < 0
}
