import express from 'express'
import cors from 'cors'
import { hashMessage } from './lib/utils.js'
import { burnNonce, isValidateNonce } from './lib/nonce.js'
import { toHex } from 'ethereum-cryptography/utils'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
const app = express()
const port = 3042

app.use(cors())
app.use(express.json())

const balances = {
    '0xdeabea9c4cae26c86f0e237f74f99b0fff6a0307': 100,
    '0x1a4b339027b5e5ce40ea8c3adaa51dc0269af21f': 50,
    '0x05a14d0df27627b0b53bf6c682bf0390ef211071': 75,
}

app.get('/balance/:address', (req, res) => {
    const { address } = req.params
    const balance = balances[address] || 0
    res.send({ balance })
})

app.post('/send', (req, res) => {
    const {
        tx: { sender, amount, publicKey, recipient, nonce },
        signature,
    } = req.body
    try {
        console.log(req.body)

        if (!isValidateNonce(nonce)) throw new Error('Invalid nonce!')
        const hash = toHex(hashMessage(JSON.stringify(req.body.tx)))
        console.log(`Hashed tx: ${hash}`)
        const verification = secp256k1.verify(signature, hash, publicKey)
        if (!verification) throw new Error('Verification failed!')
        console.log(`Verification: ${verification}`)

        setInitialBalance(sender)
        setInitialBalance(recipient)

        if (balances[sender] < amount) {
            res.status(400).send({ message: 'Not enough funds!' })
        } else {
            balances[sender] -= amount
            balances[recipient] += amount
            res.send({ balance: balances[sender] })
        }
    } catch (err) {
        console.error(err.message)
        res.status(400).send({ message: err.message })
    } finally {
        burnNonce(nonce)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0
    }
}
