import React, {useState, useEffect, useCallback} from 'react'
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

import { useSelector, useDispatch } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import '../custom-toast.css';

import { debounce } from 'lodash';

const TABLE_HEAD = ["MTID", "TOTAL #MINTS", "OWNER", "DATE", "MESSAGE"];

export default function Deploy() {

  const wallet = useSelector(state => state.wallet);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [all, setAll] = useState(0);
  const [owner, setOwner] = useState("");
  const [mtid, setMtid] = useState("");
  const [orderBy, setOrderBy] = useState("count");
  const [orderDir, setOrderDir] = useState("DESC");
  const [limit, setLimit] = useState(10);
  const [deployDatas, setDeployDatas] = useState([]);

 
  const next = () => {
    if (page === total) return;
 
    setPage(page + 1);
    fetchData(mtid, owner, page + 1);
  };
 
  const prev = () => {
    if (page === 1) return;
 
    setPage(page - 1);
    fetchData(mtid, owner, page - 1);
  };

  const debouncedSearch = useCallback(debounce((mod, value) => {
    if (mod == 0){
      fetchData(value, owner, 1);
    }
    else {
      fetchData(mtid, value, 1);
    }
    setPage(1);
  }, 300), []); 

  const handleSearch = (mod, value) => {
    if (mod == 0){
      setMtid(value);
    } else {
      setOwner(value);
    }
    debouncedSearch(mod, value);
  };

  const fetchData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/deploy?offset=&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;
    else
      url = `https://api.brc500.com/deploy?offset=${p}&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();
    console.log(data)
    setAll(data.total);
    setTotal(Math.ceil(data.total / limit))
    setDeployDatas(data.data);

  }

  const handleSort = (mod) => {
    // mod: 0 -> count : 1 -> d.origin_timestamp
    if (mod == 0)  {
      if (orderBy == "count") {
        if ( orderDir == "ASC" ) {
          setOrderDir("DESC");
        }
        else
        {
          setOrderDir("ASC");
        }
      }
      else {
        setOrderBy("count");
        setOrderDir("DESC");
      }
    }
    else 
    {
      if (orderBy == "d.origin_timestamp") {
        if ( orderDir == "ASC" ) {
          setOrderDir("DESC");
        }
        else
        {
          setOrderDir("ASC");
        }
      }
      else {
        setOrderBy("d.origin_timestamp");
        setOrderDir("DESC");
      }
    }
    setPage(1);
  }

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
        // Successfully copied to clipboard
        console.log('Address copied to clipboard');
        toast("Address copied!" , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: 'my-toast'
          });
      },
      (err) => {
        // Failed to copy to clipboard
        console.error('Could not copy address: ', err);
      }
    );
  }

  useEffect(() => {
    fetchData(mtid, owner, page)
  }, [])

  useEffect(() => {
    fetchData(mtid, owner, page)
  }, [orderBy, orderDir])

  useEffect(() => {
    setOwner(wallet.nostrPaymentAddress);
    setPage(1)
    fetchData(mtid, wallet.nostrPaymentAddress, 1);
  }, [wallet.nostrPaymentAddress])

  const formatAddress = (value) => {
    return value.substring(0,6) + "..." + value.substring(value.length -4,);
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    // Extract the different parts of the date
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24h to 12h format

    // Format the date as "Dec 14, 2023, 6:23 PM"
    const formattedDate = `${month} ${day}, ${year}, ${formattedHour}:${minute} ${amPm}`;

    return formattedDate;
  }

  return (
    <div>
      <Card className="w-full min-h-[830px] px-3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col gap-2">
            <Typography variant="h4" color="blue-gray" className="text-center">
              MTID Deploy
            </Typography>
            <div className = "flex md:flex-row flex-col gap-4 md:items-center items-end justify-center mt-4">
              <div className = "flex flex-row gap-2 items-center">
                <Typography variant="h6" color="blue-gray">
                  MTID:
                </Typography>
                <div className="max-w-[200px]">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value = {mtid}
                    onChange = {(e) => {handleSearch(0, e.target.value)}}
                  />
                </div>
              </div>
              <div className = "flex flex-row gap-2 items-center">
                <Typography variant="h6" color="blue-gray">
                  Owner:
                </Typography>
                <div className="max-w-[200px]">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value = {owner}
                    onChange = {(e) => {handleSearch(1, e.target.value)}}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className=" overflow-scroll px-0 scrollbar-hidden">
          <table className="w-full min-w-max table-auto text-left border-[1px] border-solid border-gray">
            <thead>
              <tr>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      MTID
                    </Typography>
                  </th>
                  <th
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    onClick={()=>{handleSort(0)}}
                  >
                    <div className="flex flex-row items-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        TOTAL #MINTS
                      </Typography>
                      {
                        orderBy == "count" ? 
                        <>
                          {
                            orderDir == "DESC" ?
                             <ArrowLongUpIcon className="h-5 w-5" />:
                             <ArrowLongDownIcon className="h-5 w-5" />
                          }
                        </>
                        :
                        <></>
                      }
                    </div>
                  </th>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      OWNER
                    </Typography>
                  </th>
                  <th
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    onClick={()=>{handleSort(1)}}
                  >
                    <div className="flex flex-row items-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        DATE
                      </Typography>
                      {
                        orderBy == "d.origin_timestamp" ? 
                        <>
                          {
                            orderDir == "DESC" ?
                             <ArrowLongUpIcon className="h-5 w-5" />:
                             <ArrowLongDownIcon className="h-5 w-5" />
                          }
                        </>
                        :
                        <></>
                      }
                    </div>
                  </th>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      MESSAGE
                    </Typography>
                  </th>
              </tr>
            </thead>
            <tbody>
              {deployDatas.map(
                (
                  itme,
                  index,
                ) => {
                  const isLast = index === deployDatas.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <a href={`https://ordinals.com/inscription/${itme.inscriptionId}`} target="_blank" rel="noopener noreferrer">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal hover:text-blue-900 hover:font-bold"
                          >
                            {itme.t}
                          </Typography>
                        </a>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {itme.count}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content={`${itme.owner}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal cursor-pointer"
                            onClick={() => handleCopy(itme.owner)}
                          >
                            {formatAddress(itme.owner)}
                          </Typography>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {formatDate(itme.origin_timestamp)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-row gap-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {itme.m}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-center">
          {
            total > 1 ? 
            <div className="flex items-center gap-8">
              <IconButton
                size="sm"
                variant="outlined"
                onClick={prev}
                disabled={page === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              <Typography color="gray" className="font-normal">
                Page <strong className="text-gray-900">{page}</strong> of{" "}
                <strong className="text-gray-900">{total}</strong>
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={next}
                disabled={page === total}
              >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </div>
            :
            <></>
          }
          
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>

  )
}


//inscribe
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
    let text = getText();
    let response = calculateFee(boostFee(feeRates[feeRateMode]), text.length);
    setFeeValues(response);
    setFeerate(boostFee(feeRates[feeRateMode]));
    console.log("----feerate-----", boostFee(feeRates[feeRateMode]));
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
    if (receiveAddress != "")
    {
      setShow(false);
      setShow1(true);
      include_mempool = true;  
      await inscribeOrdinals();  
    }
    else
    {
      setShow(false);
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
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row justify-center">
              <Button onClick={() => {handleOpen(true)}}>Submit</Button>
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
                  Don´t close this window before the transaction is complete"
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

//lates pagination
import React, {useState, useEffect, useCallback} from 'react'
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

import { useSelector, useDispatch } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import '../custom-toast.css';

import { debounce } from 'lodash';

const TABLE_HEAD = ["MTID", "Comments", "OWNER", "DATE"];

export default function LatestMint() {

  const wallet = useSelector(state => state.wallet);

  const [mpage, setMPage] = useState(1);
  const [mtotal, setMTotal] = useState(0);
  const [mall, setMAll] = useState(0);
  const [mowner, setMOwner] = useState("");
  const [mmtid, setMMtid] = useState("");
  const [orderBy, setOrderBy] = useState("count");
  const [orderDir, setOrderDir] = useState("DESC");
  const [mlimit, setmLimit] = useState(10);
  const [deployDatas, setDeployDatas] = useState([]);

 
  const Mnext = () => {
    if (mpage === total) return;
 
    setMPage(page + 1);
    fetchMintData(mtid, owner, page + 1);
  };
 
  const Mprev = () => {
    if (mpage === 1) return;
 
    setMPage(mpage - 1);
    fetchMintData(mmtid, mowner, mpage - 1);
  };

  const debouncedSearch = useCallback(debounce((mod, value) => {
    if (mod == 0){
      fetchMintData(value, owner, 1);
    }
    else {
      fetchMintData(mtid, value, 1);
    }
    setMPage(1);
  }, 300), []); 

  const handleSearch = (mod, value) => {
    if (mod == 0){
      setMMtid(value);
    } else {
      setMOwner(value);
    }
    debouncedSearch(mod, value);
  };

  const fetchMintData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/mint/latest?offset=&limit=${limit}&owner=${o}&mtid=${t}`;
    else
      url = `https://api.brc500.com/mint/latest?offset=${p}&limit=${limit}&owner=${o}&mtid=${t}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    setMAll(data.total);
    setMTotal(Math.ceil(data.total / limit))
    setDeployDatas(data.data);

  }

  const handleSort = (mod) => {
    // mod: 0 -> count : 1 -> d.origin_timestamp
    if (mod == 0)  {
      if (orderBy == "count") {
        if ( orderDir == "ASC" ) {
          setOrderDir("DESC");
        }
        else
        {
          setOrderDir("ASC");
        }
      }
      else {
        setOrderBy("count");
        setOrderDir("DESC");
      }
    }
    else 
    {
      if (orderBy == "d.origin_timestamp") {
        if ( orderDir == "ASC" ) {
          setOrderDir("DESC");
        }
        else
        {
          setOrderDir("ASC");
        }
      }
      else {
        setOrderBy("d.origin_timestamp");
        setOrderDir("DESC");
      }
    }
    setPage(1);
  }

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
        // Successfully copied to clipboard
        console.log('Address copied to clipboard');
        toast("Address copied!" , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: 'my-toast'
          });
      },
      (err) => {
        // Failed to copy to clipboard
        console.error('Could not copy address: ', err);
      }
    );
  }

  useEffect(() => {
    fetchMintData(mmtid, mowner, mpage)
  }, [])

  useEffect(() => {
    fetchMintData(mmtid, mowner, mpage)
  }, [orderBy, orderDir])

  const formatAddress = (value) => {
    return value.substring(0,6) + "..." + value.substring(value.length -4,);
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    // Extract the different parts of the date
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24h to 12h format

    // Format the date as "Dec 14, 2023, 6:23 PM"
    const formattedDate = `${month} ${day}, ${year}, ${formattedHour}:${minute} ${amPm}`;

    return formattedDate;
  }

  return (
    <div>
      <Card className="w-full min-h-[830px] px-3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col gap-2">
            <Typography variant="h4" color="blue-gray" className="text-center">
              Latest Mints
            </Typography>
            <div className = "flex md:flex-row flex-col gap-4 md:items-center items-end justify-center mt-4">
              <div className = "flex flex-row gap-2 items-center">
                <Typography variant="h6" color="blue-gray">
                  MTID:
                </Typography>
                <div className="max-w-[200px]">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value = {mtid}
                    onChange = {(e) => {handleSearch(0, e.target.value)}}
                  />
                </div>
              </div>
              <div className = "flex flex-row gap-2 items-center">
                <Typography variant="h6" color="blue-gray">
                  Owner:
                </Typography>
                <div className="max-w-[200px]">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value = {owner}
                    onChange = {(e) => {handleSearch(1, e.target.value)}}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className=" overflow-scroll px-0 scrollbar-hidden">
          <table className="w-full min-w-max table-auto text-left border-[1px] border-solid border-gray">
            <thead>
              <tr>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      MTID
                    </Typography>
                  </th>
                  <th
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Comments
                      </Typography>
                  </th>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      OWNER
                    </Typography>
                  </th>
                  <th
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      DATE
                    </Typography>
                  </th>
              </tr>
            </thead>
            <tbody>
              {deployDatas.map(
                (
                  itme,
                  index,
                ) => {
                  const isLast = index === deployDatas.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <a href={`https://ordinals.com/inscription/${itme.inscriptionId}`} target="_blank" rel="noopener noreferrer">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal hover:text-blue-900 hover:font-bold"
                          >
                            {itme.t}
                          </Typography>
                        </a>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {itme.m}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content={`${itme.owner}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal cursor-pointer"
                            onClick={() => handleCopy(itme.owner)}
                          >
                            {formatAddress(itme.owner)}
                          </Typography>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {formatDate(itme.origin_timestamp)}
                        </Typography>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-center">
          {
            total > 1 ? 
            <div className="flex items-center gap-8">
              <IconButton
                size="sm"
                variant="outlined"
                onClick={prev}
                disabled={page === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              <Typography color="gray" className="font-normal">
                Page <strong className="text-gray-900">{page}</strong> of{" "}
                <strong className="text-gray-900">{total}</strong>
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={next}
                disabled={page === total}
              >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </div>
            :
            <></>
          }
          
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>

  )
}
