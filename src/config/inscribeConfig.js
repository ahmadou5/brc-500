import { encodedAddressPrefix, padding, tip, mempoolNetwork } from '@/config/constant';

export const getFeeRate = async() => {
  try {
    let response = await fetch("https://mempool.space/api/v1/fees/recommended");
    response = await response.json();
    let feeRate = {
      "Fast": response["fastestFee"],
      "Normal": response["hourFee"],
      "Slow": response["minimumFee"],
    }
    return feeRate;
  } catch (error) {
    console.log(error);
  }
}

export const calculateFee = (feeRate, dataSize) => {
  let base_size = 160;
  let prefix = 160;
  let txsize = prefix + Math.floor(dataSize / 4);
  let inscriptionLength = 1;
  let inscriptionFee = (padding * inscriptionLength);
  let networkFee = ( ( 69 + ( ( inscriptionLength + 1 ) * 2 ) * 31 + 10 ) * feeRate ) + (base_size * inscriptionLength) + (prefix + Math.floor(dataSize / 4)) * feeRate;
  let serviceFee = tip;
  let totalFee = inscriptionFee + networkFee + serviceFee;
  return {
    "inscriptionFee": inscriptionFee,
    "networkFee": networkFee,
    "serviceFee": serviceFee,
    "totalFee": totalFee
  }
}

export const bytesToHex = (bytes) => {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

export const buf2hex = (buffer) => { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

export const textToHex = (text) => {
  var encoder = new TextEncoder().encode(text);
  return [...new Uint8Array(encoder)]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("");
}

export const hexToBytes = (hex) => {
  return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

export const satsToDollars =  async(sats) => {
  if (sats >= 100000000) sats = sats * 10;
  let bitcoin_price = sessionStorage["bitcoin_price"];
  let value_in_dollars = Number(String(sats).padStart(8, "0").slice(0, -9) + "." + String(sats).padStart(8, "0").slice(-9)) * bitcoin_price;
  return value_in_dollars;
}

export const satsToBitcoin =  async(sats) => {
  if (sats >= 100000000) sats = sats * 10;
  let string = String(sats).padStart(8, "0").slice(0, -9) + "." + String(sats).padStart(8, "0").slice(-9);
  if (string.substring(0, 1) == ".") string = "0" + string;
  return string;
}

export const loopTilAddressReceivesMoney = async(address, includeMempool) => {
  let itReceivedMoney = false

  async function isDataSetYet(data_i_seek) {
    return new Promise(function (resolve, reject) {
      if (!data_i_seek) {
        setTimeout(async function () {
          try {
            itReceivedMoney = await addressOnceHadMoney(
              address,
              includeMempool
            )
          } catch (e) {}
          let msg = await isDataSetYet(itReceivedMoney)
          resolve(msg)
        }, 2000)
      } else {
        resolve(data_i_seek)
      }
    })
  }

  async function getTimeoutData() {
    let data_i_seek = await isDataSetYet(itReceivedMoney)
    return data_i_seek
  }

  let returnable = await getTimeoutData()
  return returnable
}

const addressOnceHadMoney = async(address, includeMempool) => {
  let url
  let nonjson
  try {
    url = 'https://mempool.space/' + mempoolNetwork + 'api/address/' + address
    nonjson = await getData(url)

    if (
      nonjson.toLowerCase().includes('rpc error') ||
      nonjson.toLowerCase().includes('too many requests') ||
      nonjson.toLowerCase().includes('bad request')
    ) {
      if (encodedAddressPrefix == 'main') {
        url = 'https://blockstream.info/api/address/' + address
        nonjson = await getData(url)
      }
    }
  } catch (e) {
    if (encodedAddressPrefix == 'main') {
      url = 'https://blockstream.info/api/address/' + address
      nonjson = await getData(url)
    }
  }

  if (!isValidJson(nonjson)) return false
  let json = JSON.parse(nonjson)
  if (
    json['chain_stats']['tx_count'] > 0 ||
    (includeMempool && json['mempool_stats']['tx_count'] > 0)
  ) {
    return true
  }
  return false
}

const isValidJson = (content) => {
  if (!content) return
  try {
    var json = JSON.parse(content)
  } catch (e) {
    return
  }
  return true
}

export const addressReceivedMoneyInThisTx = async(address) => {
  let txid;
  let vout;
  let amt;
  let nonjson;

  try
  {
      nonjson = await getData("https://mempool.space/" + mempoolNetwork + "api/address/" + address + "/txs");

      if(nonjson.toLowerCase().includes('rpc error') || nonjson.toLowerCase().includes('too many requests') || nonjson.toLowerCase().includes('bad request'))
      {
          if(encodedAddressPrefix == 'main')
          {
              nonjson = await getData("https://blockstream.info/api/address/" + address + "/txs");
          }
      }
  }
  catch(e)
  {
      if(encodedAddressPrefix == 'main')
      {
          nonjson = await getData("https://blockstream.info/api/address/" + address + "/txs");
      }
  }

  let json = JSON.parse(nonjson);
  json.forEach(function (tx) {
      tx["vout"].forEach(function (output, index) {
          if (output["scriptpubkey_address"] == address) {
              txid = tx["txid"];
              vout = index;
              amt = output["value"];
          }
      });
  });
  return [txid, vout, amt];
}

export const getData = (url) => {
  return new Promise(async function (resolve, reject) {
    function inner_get(url) {
      let xhttp = new XMLHttpRequest()
      xhttp.open('GET', url, true)
      xhttp.send()
      return xhttp
    }

    let data = inner_get(url)
    data.onerror = function (e) {
      resolve('error')
    }

    async function isResponseReady() {
      return new Promise(function (resolve2, reject) {
        if (!data.responseText || data.readyState != 4) {
          setTimeout(async function () {
            let msg = await isResponseReady()
            resolve2(msg)
          }, 1)
        } else {
          resolve2(data.responseText)
        }
      })
    }

    let returnable = await isResponseReady()
    resolve(returnable)
  })
}


export const waitSomeSeconds = (number) => {
  let num = number.toString() + '000'
  num = Number(num)
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('')
    }, num)
  })
}

export const pushBTCpmt = async(rawtx) => {

  let txid;

  try
  {
      txid = await postData("https://mempool.space/" + mempoolNetwork + "api/tx", rawtx);

      if( ( txid.toLowerCase().includes('rpc error') || txid.toLowerCase().includes('too many requests') || txid.toLowerCase().includes('bad request') ) && !txid.includes('descendant'))
      {
          if(encodedAddressPrefix == 'main')
          {
              console.log('USING BLOCKSTREAM FOR PUSHING INSTEAD');
              txid = await postData("https://blockstream.info/api/tx", rawtx);
          }
      }
  }
  catch(e)
  {
      if(encodedAddressPrefix == 'main')
      {
          console.log('USING BLOCKSTREAM FOR PUSHING INSTEAD');
          txid = await postData("https://blockstream.info/api/tx", rawtx);
      }
  }

  return txid;
}

export const postData =  async(url, json, content_type = "", apikey = "") => {
  let rtext = "";

  function inner_post(url, json, content_type = "", apikey = "") {
      let xhttp = new XMLHttpRequest();
      xhttp.open("POST", url, true);
      if (content_type) {
          xhttp.setRequestHeader(`Content-Type`, content_type);
      }
      if (apikey) {
          xhttp.setRequestHeader(`X-Api-Key`, apikey);
      }
      xhttp.send(json);
      return xhttp;
  }

  let data = inner_post(url, json, content_type, apikey);
  data.onerror = function (e) {
      rtext = "error";
  }

  async function isResponseReady() {
      return new Promise(function (resolve, reject) {
          if (rtext == "error") {
              resolve(rtext);
          }
          if (!data.responseText || data.readyState != 4) {
              setTimeout(async function () {
                  let msg = await isResponseReady();
                  resolve(msg);
              }, 50);
          } else {
              resolve(data.responseText);
          }
      });
  }

  let returnable = await isResponseReady();
  return returnable;
}