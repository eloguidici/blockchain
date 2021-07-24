const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction

const contractJson = require('../build/contracts/Oracle.json')

const web3 = new Web3('ws://127.0.0.1:7545')

const addressContract = '0xC659655A13F6B02a98ed3E1AEF656aec23C9bcD2'

const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract)

const privateKey = Buffer.from('167b3d9a9e3fa3ac5c0f4f311828ab81d178077e82af271dfe3e731acc9e8983', 'hex')
const address = '0xeFdfde2F7f4544cFbe113a2f2ab1719023eb9063'

var accounts = web3.eth.accounts;
var account = accounts[0];
console.log(account);

web3.eth.getBlockNumber()
    .then(n => listenEvent(n - 1));

function listenEvent(lastBlock) {
    console.log("listenEvent");
    contractInstance.events.__calbackNewDollarValueData({}, { fromBlock: lastBlock, toBlock: 'latest' }, (err, event) => {
        event ? getDataFromOracle() : null
        err ? console.log(err) : null
    });
}

function getDataFromOracle() {
    const url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales'

    fetch(url)
        .then(response => response.json())
        .then(json => set(json));
}

function set(_value) {

    //    console.log(_value);
    var blue = _value.find((item) => item.casa.nombre == "Dolar Blue");
    var dolar = _value.find((item) => item.casa.nombre == "Dolar");
    var bolsa = _value.find((item) => item.casa.nombre == "Dolar Bolsa");
    var liqui = _value.find((item) => item.casa.nombre == "Dolar Contado con Liqui");
    var soja = _value.find((item) => item.casa.nombre == "Dolar Soja");
    var oficial = _value.find((item) => item.casa.nombre == "Dolar Oficial");

    // console.log(blue.casa.venta);
    try {
        web3.eth.getTransactionCount(address, (err, txNum) => {
            contractInstance.methods.set("blue", blue.casa.nombre, blue.casa.venta).estimateGas({}, (err, gasAmount) => {
                let rawTx = {
                    nonce: web3.utils.toHex(txNum),
                    gasPrice: web3.utils.toHex(20000000000),
                    gasLimit: web3.utils.toHex(6721975),
                    to: addressContract,
                    value: '0x00',
                    data: contractInstance.methods.set("blue", blue.casa.nombre, blue.casa.venta).encodeABI()
                };

                const tx = new Tx(rawTx);
                tx.sign(privateKey);
                const serializedTx = tx.serialize().toString('hex');
                web3.eth.sendSignedTransaction('0x' + serializedTx);
            })
        })
    } catch (error) {
        console.log(error);
    }

}

app.get('/getDataFromOracle', (req, res) => {
    getDataFromOracle();

    res.send('Hello World!')
})

app.get('/getCot', (req, res) => {
    getDataFromOracle();

    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})