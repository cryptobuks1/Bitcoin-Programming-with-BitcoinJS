const bitcoin = require('bitcoinjs-lib')
const { alice, bob, carol, dave } = require('./wallets.json')
const network = bitcoin.networks.regtest

// Participants
const keyPairAlice1 = bitcoin.ECPair.fromWIF(alice[1].wif, network)
const keyPairBob1 = bitcoin.ECPair.fromWIF(bob[1].wif, network)
const keyPairCarol1 = bitcoin.ECPair.fromWIF(carol[1].wif, network)
const keyPairDave1 = bitcoin.ECPair.fromWIF(dave[1].wif, network)

// Recipient
const keyPairAlice2 = bitcoin.ECPair.fromWIF(alice[2].wif, network)
const p2wpkhAlice2 = bitcoin.payments.p2wpkh({pubkey: keyPairAlice2.publicKey, network})

// Build transaction
const p2ms = bitcoin.payments.p2ms({
  m: 2, pubkeys: [
    keyPairAlice1.publicKey,
    keyPairBob1.publicKey,
    keyPairCarol1.publicKey,
    keyPairDave1.publicKey], network})

console.log('Redeem script:')
console.log(p2ms.output.toString('hex'))
console.log()

console.log('Redeem script Hash160:')
console.log(bitcoin.crypto.hash160(Buffer.from(p2ms.output.toString('hex'), 'hex')).toString('hex'))
console.log()

const p2sh = bitcoin.payments.p2sh({redeem: p2ms, network})
console.log('P2SH address:')
console.log(p2sh.address)
console.log()

const txb = new bitcoin.TransactionBuilder(network)

txb.addInput('TX_ID', TX_VOUT)
txb.addOutput(p2wpkhAlice2.address, 999e5)


// Signing
// txb.sign(index, keyPair, redeemScript, sign.hashType, value, witnessScript)
txb.sign(0, keyPairAlice1, p2sh.redeem.output)
txb.sign(0, keyPairBob1, p2sh.redeem.output)


const tx = txb.build()
console.log('Transaction hexadecimal:')
console.log(tx.toHex())