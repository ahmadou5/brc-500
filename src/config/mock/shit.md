import React, {useState, useEffect} from 'react'
import { 
  ButtonGroup, 
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography, 
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner
} from "@material-tailwind/react";
import FeeRateCard from './FeeRateCard';
import { getFeeRate, bytesToHex, buf2hex, textToHex, hexToBytes, loopTilAddressReceivesMoney, waitSomeSeconds, addressReceivedMoneyInThisTx, pushBTCpmt, calculateFee, getData} from '../util/inscribe-util';
import { encodedAddressPrefix, padding, tip, tippingAddress, mempoolNetwork } from '../configs/constant';

import { sendBtcTransaction } from 'sats-connect'

import { ToastContainer, toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import '../custom-toast.css';

export default function Inscribe() {

  const wallet = useSelector(state => state.wallet);

  let pushing = false;
  let include_mempool = true;
  const { Address, Script, Signer, Tap, Tx } = window.tapscript;
  const feeRateTabs = ["Slow", "Normal", "Fast"];
  const [mode, setMode] = useState("Deploy");
  const [feeRateMode, setFeeRateMode] = useState("Normal");
  const [feerate, setFeerate] = useState(0);
  const [feeRates, setFeeRates] = useState({});
  const [feeValues, setFeeValues] = useState({});
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [mtid, setMtid] = useState("");
  const [message, setMessage] = useState("");
  const [txid, setTxid] = useState("");
  const [inscriptionStatus, setInscriptionStatus] = useState(false);

  useEffect(() => {
    let intervalId;

    const updateFees = async () => {
      try {
        let response = await getFeeRate();
        setFeeRates(response);
        setFeerate(boostFee(response[feeRateMode]));
      }
      catch (e) {
        console.log(e);
      }
    }
    updateFees();
    intervalId = setInterval(updateFees, 10 * 1000);
    return () => {
      clearInterval(intervalId);
    }
  }, [])

  useEffect(() => {
    let text = getText();
    let response1 = calculateFee(feerate, text.length);
    setFeeValues(response1);
  }, [mtid, message])

  useEffect(() => {
    let text = getText();
    let response = calculateFee(boostFee(feeRates[feeRateMode]), text.length);
    setFeeValues(response);
    setFeerate(boostFee(feeRates[feeRateMode]));
  }, [feeRateMode])

  useEffect(() => {
    setReceiveAddress(wallet.nostrOrdinalsAddress);
  }, [wallet.nostrOrdinalsAddress])

  const handleOpen = async (value) => {
    if (value == true) {
      if (wallet.nostrPaymentAddress == "")
      {
        toast("Please connect wallet first." , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: 'error-toast'
        });
        return;
      }
      if (mtid == "" || message =="")
      {
        toast("Please insert values." , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: 'error-toast'
        });
        return;
      }
      else
      {
        let response = await getFeeRate();
        setFeeRates(response);
        let text = getText();
        let response1 = calculateFee(boostFee(response[feeRateMode]), text.length);
        setFeeValues(response1);
        setFeerate(boostFee(response[feeRateMode]));
      }
    }
    setShow(value);
  }

  const boostFee = (value) => {
    return Math.floor(value * 1.1)
  }

  const getText = () => {
    let text = '';
    if (mode == "Deploy") {
      text = `{"p":"brc500","o":"deploy","t":"${mtid}","m":"${message}"}`;
    }
    else // "Mint"
    {
      text = `{"p":"brc500","o":"mint","t":"${mtid}","c":"${message}"}`;
    }
    return text;
  }

  const inscribeOrdinals = async () => {
    if (!typeof window) return
    if (!window.tapscript) return

    let cryptoUtils = window.cryptoUtils;
    const KeyPair = cryptoUtils.KeyPair;

    let privkey = bytesToHex(cryptoUtils.Noble.utils.randomPrivateKey());

    console.log("-----privkey-----", privkey);

    // Create a keypair to use for testing
    let seckey = new KeyPair(privkey);
    let pubkey = seckey.pub.rawX;

    const ec = new TextEncoder();

    const init_script = [
      pubkey,
      'OP_CHECKSIG'
    ];
    
    const init_script_backup = [
        '0x' + buf2hex(pubkey.buffer),
        'OP_CHECKSIG'
    ];

    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {target: init_leaf});

    const test_redeemtx = Tx.create({
      vin  : [{
          txid: 'a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968',
          vout: 0,
          prevout: {
              value: 10000,
              scriptPubKey: [ 'OP_1', init_tapkey ]
          },
      }],
      vout : [{
          value: 8000,
          scriptPubKey: [ 'OP_1', init_tapkey ]
      }],
    });
    
    const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {extension: init_leaf});
    test_redeemtx.vin[0].witness = [ test_sig.hex, init_script, init_cblock ];
    const isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });

    if(!isValid)
    {
      alert('Generated keys could not be validated. Please reload the app.');
      return;
    }

    console.log('PUBKEY', pubkey);

    let files = [];
    let text = getText();

    let mimetype = "text/plain;charset=utf-8";

    files.push({
      text: JSON.stringify(text),
      name: textToHex(text),
      hex: textToHex(text),
      mimetype: mimetype,
      sha256: ''
    });

    let base_size = 160;

    let inscriptions = [];

    let total_fee = 0;
 
    for (let i = 0; i < files.length; i++) {

      console.log(files, '-----------')

      const hex = files[i].hex;
      const data = hexToBytes(hex);
      const mimetype = ec.encode(files[i].mimetype);

      const script = [
          pubkey,
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          ec.encode('ord'),
          '01',
          mimetype,
          'OP_0',
          data,
          'OP_ENDIF'
      ];

      const script_backup = [
          '0x' + buf2hex(pubkey.buffer),
          'OP_CHECKSIG',
          'OP_0',
          'OP_IF',
          '0x' + buf2hex(ec.encode('ord')),
          '01',
          '0x' + buf2hex(mimetype),
          'OP_0',
          '0x' + buf2hex(data),
          'OP_ENDIF'
      ];

      const leaf = await Tap.tree.getLeaf(Script.encode(script));
      const [tapkey, cblock] = await Tap.getPubKey(pubkey, { target: leaf });

      let inscriptionAddress = Address.p2tr.encode(tapkey, encodedAddressPrefix);

      console.log('Inscription address: ', inscriptionAddress);
      console.log('Tapkey:', tapkey);
      console.log('---feerate----', feerate);

      let prefix = 160;

      if(files[i].sha256 != '')
      {
          prefix = feerate > 1 ? 546 : 700;
      }

      let txsize = prefix + Math.floor(data.length / 4);

      console.log("TXSIZE", txsize);

      let fee = feerate * txsize;
      total_fee += fee;

      inscriptions.push(
          {
              leaf: leaf,
              tapkey: tapkey,
              cblock: cblock,
              inscriptionAddress: inscriptionAddress,
              txsize: txsize,
              fee: fee,
              script: script_backup,
              script_orig: script
          }
      );
    }

    let total_fees = total_fee + ( ( 69 + ( ( inscriptions.length + 1 ) * 2 ) * 31 + 10 ) * feerate ) +
        (base_size * inscriptions.length) + (padding * inscriptions.length);
    
    let fundingAddress = Address.p2tr.encode(init_tapkey, encodedAddressPrefix);

    let toAddress = ""  // Insert toAddress

    total_fees += (50 * feerate) + tip;

    let transaction = [];
    transaction.push({txsize : 60, vout : 0, script: init_script_backup, output : {value: total_fees, scriptPubKey: [ 'OP_1', init_tapkey ]}});
    transaction.push({txsize : 60, vout : 1, script: init_script_backup, output : {value: total_fees, scriptPubKey: [ 'OP_1', init_tapkey ]}});

    console.log("-----inscriptions-------", inscriptions);

    try{
      if (wallet.domain == "unisat") {
        await window.unisat.sendBitcoin(fundingAddress, total_fees);
      }
      if (wallet.domain == "okxwallet") {
        await window.okxwallet.bitcoin.sendBitcoin(fundingAddress,total_fees);
      }
      if (wallet.domain == "xverseWallet") {
        const sendBtcOptions = {
          payload: {
            network: {
              type: "Mainnet",
            },
            recipients: [
              {
                address: fundingAddress,
                amountSats: total_fees,
              },
            ],
            senderAddress: 'paymentAddress',
          },
          onFinish: (response) => {
            //alert(response);
            console.log(response);
          },
          onCancel: () => alert("Payment rejected by user. Try again."),
        };

        await sendBtcTransaction(sendBtcOptions);
      }
    }
    catch(e)
    {
      console.log(e);
      alert("Payment rejected by user. Try again.");
      setShow1(false);
      return;
    }

    // Save data to database:
    saveData(privkey, fundingAddress, receiveAddress, total_fees);

    await loopTilAddressReceivesMoney(fundingAddress, true);
    await waitSomeSeconds(2);
    let txinfo = await addressReceivedMoneyInThisTx(fundingAddress);

    let txid = txinfo[0];
    let vout = txinfo[1];
    let amt = txinfo[2];

    let outputs = [];

    transaction = [];
    transaction.push({txsize : 60, vout : vout, script: init_script_backup, output : {value: amt, scriptPubKey: [ 'OP_1', init_tapkey ]}});

    for (let i = 0; i < inscriptions.length; i++) {

        outputs.push(
            {
                value: padding + inscriptions[i].fee,
                scriptPubKey: [ 'OP_1', inscriptions[i].tapkey ]
            }
        );

        transaction.push({txsize : inscriptions[i].txsize, vout : i, script: inscriptions[i].script, output : outputs[outputs.length - 1]});
    }

    if(!isNaN(tip) && tip >= 500)
    {
        outputs.push(
            {
                value: tip,
                scriptPubKey: [ 'OP_1', Address.p2tr.decode(tippingAddress, encodedAddressPrefix).hex ]
            }
        );
    }

    const init_redeemtx = Tx.create({
      vin  : [{
          txid: txid,
          vout: vout,
          prevout: {
              value: amt,
              scriptPubKey: [ 'OP_1', init_tapkey ]
          },
      }],
      vout : outputs
    })

    const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, {extension: init_leaf});
    init_redeemtx.vin[0].witness = [ init_sig.hex, init_script, init_cblock ];

    let rawtx = Tx.encode(init_redeemtx).hex;
    let _txid = await pushBTCpmt(rawtx);

    for (let i = 0; i < inscriptions.length; i++) {
      inscribe(inscriptions[i], i, seckey);
    }

  }

  const inscribe = async(inscription, vout, seckey) => {

    // we are running into an issue with 25 child transactions for unconfirmed parents.
    // so once the limit is reached, we wait for the parent tx to confirm.

    await loopTilAddressReceivesMoney(inscription.inscriptionAddress, include_mempool);
    await waitSomeSeconds(2);
    let txinfo2 = await addressReceivedMoneyInThisTx(inscription.inscriptionAddress);

    let txid2 = txinfo2[0];
    let amt2 = txinfo2[2];

    const redeemtx = Tx.create({
        vin  : [{
            txid: txid2,
            vout: vout,
            prevout: {
                value: amt2,
                scriptPubKey: [ 'OP_1', inscription.tapkey ]
            },
        }],
        vout : [{
            value: amt2 - inscription.fee,
            scriptPubKey: [ 'OP_1', Address.p2tr.decode(receiveAddress, encodedAddressPrefix).hex ]
        }],
    });

    const sig = await Signer.taproot.sign(seckey.raw, redeemtx, 0, {extension: inscription.leaf});
    redeemtx.vin[0].witness = [ sig.hex, inscription.script_orig, inscription.cblock ];

    console.dir(redeemtx, {depth: null});

    let rawtx2 = Tx.encode(redeemtx).hex;
    let _txid2;

    // since we don't know any mempool space api rate limits, we will be careful with spamming
    await isPushing();
    pushing = true;
    _txid2 = await pushBTCpmt( rawtx2 );
    await sleep(1000);
    pushing = false;

    if(_txid2.includes('descendant'))
    {
        include_mempool = false;
        inscribe(inscription, vout);
        return;
    }

    try {

        JSON.parse(_txid2);
        setShow1(false);
        toast("Error Occured!" , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: 'error-toast'
        });
    } catch (e) {
      setTxid(_txid2);
      setInscriptionStatus(true);
        // show message
    }

  }

  const isPushing = async () => {
    while (pushing) {
        await sleep(10);
    }
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const saveData = async (privkey, fundingAddress, receiveAddress, total_fees) => {
    const apiURL = 'https://api.brc500.com/saveTransation'; // Ensure this is the correct endpoint URL
    const data = {
      privkey: privkey,
      fundingAddress: fundingAddress,
      receiveAddress: receiveAddress,
      totalFee: total_fees
    };
  
    try {
      await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
    } catch (error) {
      console.error('There was an error saving the data:', error);
    }
  };

  const handleSubmit = async () => {
    if (wallet.nostrPaymentAddress == "")
    {
      toast("Please connect wallet first." , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
      });
      return;
    }

    if (receiveAddress == "") {
      toast("Please insert taproot address." , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
      });
      return;
    }

    if (mtid == "") {
      toast("Please insert mtid." , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
      });
      return;
    }

    if (message == "") {
      toast("Please insert message." , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
      });
      return;
    }

    if (receiveAddress != "" && message != "" && mtid != "")
    {
      setShow(false);
      setShow1(true);
      include_mempool = true;  
      await inscribeOrdinals();  
    }

  }

  const test = async() => {
    let url = 'https://blockstream.info/api/address/' + 'bc1p26005tzsk7ta64zuad59l29wkp2u7npgarss865ae5fj5f6g04nq5jxkpz'
    let nonjson = await getData(url)
  }

  return (
    <div className="flex flex-col gap-3 mt-5 md:w-[600px] w-full">
      {/* <Button onClick={() => {test()}}>Test</Button> */}
      <div className="flex flex-row w-full">
        <ButtonGroup variant="gradient">
          <Button onClick={() => {setMode("Deploy")}}>Deploy</Button>
          <Button className="px-8" onClick={() => {setMode("Mint")}}>Mint</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-row md:w-[600px] w-full">
        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row justify-center">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {
                    mode == "Deploy" ? "Deploy MTID | 部署MTID" : "Mint MTID | 薄荷绿 MTID"
                  }
                </Typography>
              </div>
              <div className="w-full">
                <Input label="MTID" value={mtid} onChange = {(e) => {setMtid(e.target.value)}}/>
              </div>
              <div className="w-full">
                {
                  mode == "Deploy" ?
                    <Textarea label="MTID Message | MTID消息" value={message} onChange = {(e) => {setMessage(e.target.value)}} />
                    :
                    <Textarea label="MTID Mint Comment | MTID 薄荷评论" value={message} onChange = {(e) => {setMessage(e.target.value)}} />
                }
              </div>
              <div className="border-solid border-[1px] border-b-gray-400 my-3 mx-10"></div>
              <div className="flex flex-col gap-3 w-full">
                <div className="w-full">
                  <Input label="Provide the address to receive the inscription" value={receiveAddress} onChange={(e) => { setReceiveAddress(e.target.value)}}/>
                </div>
                <div className="mt-3">
                  Select the network fee you want to pay:
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FeeRateCard header={feeRateTabs[0]} rate={feeRates[feeRateTabs[0]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[0])}}/>
                  <FeeRateCard header={feeRateTabs[1]} rate={feeRates[feeRateTabs[1]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[1])}}/>
                  <FeeRateCard header={feeRateTabs[2]} rate={feeRates[feeRateTabs[2]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[2])}}/>
                </div>
                <div className="flex flex-row justify-between md:px-10 px-3">
                  <div>Sats In Inscription:</div>
                  <div><span className="font-bold text-black">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["inscriptionFee"]}</span> sats</div>
                </div>
                <div className="flex flex-row justify-between md:px-10 px-3">
                  <div>Network fee:</div>
                  <div><span className="font-bold text-black">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["networkFee"]}</span> sats</div>
                </div>
                <div className="flex flex-row justify-between md:px-10 px-3">
                  <div>Service fee:</div>
                  <div><span className="font-bold text-black">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["serviceFee"]}</span> sats</div>
                </div>
                <div className="flex flex-row justify-between md:px-10 px-3 border-solid border-t-blue-gray-400 border-[1px]">
                </div>
                <div className="flex flex-row justify-between md:px-10 px-3">
                  <div>Total:</div>
                  <div><span className="font-bold text-black">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["totalFee"]}</span> sats</div>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row justify-center">
              <Button onClick={() => {handleSubmit()}}>Submit</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Dialog
        open={show}
        size={"md"}
        handler={() => handleOpen(false)}
      >
        <DialogHeader>
          <div className="flex flex-row w-full justify-center mt-2 text-[28px] font-bold">
            {
              mode == "Deploy" ? "Deploy BRC500" : "Mint BRC500"
            }
          </div>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full">
              <Input label="Provide the address to receive the inscription" value={receiveAddress} onChange={(e) => { setReceiveAddress(e.target.value)}}/>
            </div>
            <div className="mt-3">
              Select the network fee you want to pay:
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FeeRateCard header={feeRateTabs[0]} rate={feeRates[feeRateTabs[0]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[0])}}/>
              <FeeRateCard header={feeRateTabs[1]} rate={feeRates[feeRateTabs[1]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[1])}}/>
              <FeeRateCard header={feeRateTabs[2]} rate={feeRates[feeRateTabs[2]]} active={feeRateMode} onClick={() => {setFeeRateMode(feeRateTabs[2])}}/>
            </div>
            <div className="flex flex-row justify-between md:px-10 px-3">
              <div>Sats In Inscription:</div>
              <div><span className="font-bold text-black">{feeValues["inscriptionFee"]}</span> sats</div>
            </div>
            <div className="flex flex-row justify-between md:px-10 px-3">
              <div>Network fee:</div>
              <div><span className="font-bold text-black">{feeValues["networkFee"]}</span> sats</div>
            </div>
            <div className="flex flex-row justify-between md:px-10 px-3">
              <div>Service fee:</div>
              <div><span className="font-bold text-black">{feeValues["serviceFee"]}</span> sats</div>
            </div>
            <div className="flex flex-row justify-between md:px-10 px-3 border-solid border-t-blue-gray-400 border-[1px]">
            </div>
            <div className="flex flex-row justify-between md:px-10 px-3">
              <div>Total:</div>
              <div><span className="font-bold text-black">{feeValues["totalFee"]}</span> sats</div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex flex-row gap-3">
            <Button
              onClick={() => {handleSubmit()}}
              className="py-[12px] mr-3"
            >
              <span>Submit</span>
            </Button>
            <Button
              onClick={() => handleOpen(false)}
              className="py-[12px] mr-3"
            >
              <span>Cancel</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={show1}
        size={"sm"}
      >
        <DialogHeader>
          {
            inscriptionStatus ? 
              <div className="flex flex-row w-full justify-center mt-2 text-[28px] font-bold text-green-700">
                Inscription Success
              </div>
              :
              <div className="flex flex-row w-full justify-center mt-2 text-[28px] font-bold">
                Inscribing Now
              </div>
          }
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3 w-full min-h-[200px]">
            {
              inscriptionStatus ? 
              <div className="flex flex-col items-center gap-8">
                {/* <div className="flex flex-row justify-center w-full text-[20px] px-6">
                  Please check brc500 <a href={`https://ordinals.com/inscription/${txid}i0`} target="_blank" className="cursor-pointer text-blue-700 font-bold">&nbsp;here</a>
                </div> */}
                <div className="flex flex-row justify-center w-full text-[20px] px-6">
                  Thank you for participating. Together we are changing the digital landscape.
                </div>
                <Button

                  onClick={() => {
                    setShow1(false);
                    setInscriptionStatus(false);
                  }}
                >Close</Button>
              </div>
              :
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-row justify-center w-full text-red-500 text-[20px] px-6">
                  Don´t close this window before the transaction is complete
                </div>
                <Spinner className="h-12 w-12" />
              </div>
            }
          </div>
        </DialogBody>
      </Dialog>
      <ToastContainer />
    </div>
  )
}
