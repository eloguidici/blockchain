const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const fetch = require('node-fetch')

const contractJson = require('../build/contracts/Oracle.json')

const web3 = new Web3('ws://127.0.0.1:7545')

const addressContract = '0xC659655A13F6B02a98ed3E1AEF656aec23C9bcD2'

const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract)

const privateKey = Buffer.from('167b3d9a9e3fa3ac5c0f4f311828ab81d178077e82af271dfe3e731acc9e8983', 'hex')
const address = '0xeFdfde2F7f4544cFbe113a2f2ab1719023eb9063'

web3.eth.getBlockNumber()
    .then(n => listenEvent(n - 1))

function listenEvent(lastBlock) {
    contractInstance.events.__calbackNewDollarValueData({}, { fromBlock: lastBlock, toBlock: 'latest' }, (err, event) => {
        event ? getDataFromOracle() : null
        err ? console.log(err) : null
    });
}

function getDataFromOracle() {
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2019-10-12&end_date=2019-10-16&api_key=DEMO_KEY'

    fetch(url)
        .then(response => response.json())
        .then(json => set(json.element_count));
}

function set(_value) {
    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.set(_value).estimateGas({}, (err, gasAmount) => {
            let rawTx = {
                nonce: web3.utils.toHex(txNum),
                gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                gasLimit: web3.utils.toHex(gasAmount),
                to: addressContract,
                value: '0x00',
                data: contractInstance.methods.set(_value).encodeABI()
            };

            const tx = new Tx(rawTx);
            tx.sign(privateKey);
            const serializedTx = tx.serialize().toString('hex');
            web3.eth.sendSignedTransaction('0x' + serializedTx);
        })
    })
}