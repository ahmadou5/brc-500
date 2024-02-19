"use client";
import { Navbar } from "@/components/Navbar";
import { SearchView, MyDeploys } from "@/components/Card/SearcView";
import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import { Card, Token } from "@/components/Card";
import { GlobalContext } from "@/context/context";
import { WalletModal } from "@/components/Modal/WalletModal";
import { Footer } from "@/components/Footer";
import { sendBtcTransaction } from "sats-connect";
import { InscribeModal } from "@/components/Modal/InscribeModal";
import { ConnectButton, ConnectSmallButton } from "@/components/Buttons";
import { Address, Script, Signer, Tap, Tx } from "@cmdcode/tapscript";
import * as CryptoUtils from '@cmdcode/crypto-utils'
import * as secp from '@noble/secp256k1'
import {
  getFeeRate,
  bytesToHex,
  buf2hex,
  textToHex,
  hexToBytes,
  loopTilAddressReceivesMoney,
  waitSomeSeconds,
  addressReceivedMoneyInThisTx,
  pushBTCpmt,
  calculateFee,
  getData,
} from "@/config/inscribeConfig";
import {
  encodedAddressPrefix,
  padding,
  tip,
  tippingAddress,
  mempoolNetwork,
} from "@/config/constant";
import { Connected } from "@/components/Modal/Connected";

export default function Inscribe() {
  const { data, wallet:walletType , setWallet, address, isWalletModal, connect, setIsWalletModal } = GlobalContext();

  const wallet = address;

  let pushing = false;
  let include_mempool = true;
  // const { Address, Script, Signer, Tap, Tx } = window.tapscript;
  const feeRateTabs = ["Slow", "Normal", "Fast"];
  const [mode, setMode] = useState("Mint");
  const [isMint, setIsMint] = useState(true);
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
      } catch (e) {
        console.log(e);
      }
    };
    updateFees();
    intervalId = setInterval(updateFees, 10 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let text = getText();
    let response1 = calculateFee(feerate, text.length);
    setFeeValues(response1);
  }, [mtid, message]);

  useEffect(() => {
    let text = getText();
    let response = calculateFee(boostFee(feeRates[feeRateMode]), text.length);
    setFeeValues(response);
    setFeerate(boostFee(feeRates[feeRateMode]));
  }, [feeRateMode]);

  useEffect(() => {
    setReceiveAddress(wallet);
  }, [wallet]);

  const handleOpen = async (value) => {
    if (value == true) {
      if (wallet.nostrPaymentAddress == "") {
        toast("Please connect wallet first.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "error-toast",
        });
        return;
      }
      if (mtid == "" || message == "") {
        toast("Please insert values.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "error-toast",
        });
        return;
      } else {
        let response = await getFeeRate();
        setFeeRates(response);
        let text = getText();
        let response1 = calculateFee(
          boostFee(response[feeRateMode]),
          text.length
        );
        setFeeValues(response1);
        setFeerate(boostFee(response[feeRateMode]));
      }
    }
    setShow(value);
  };

  const boostFee = (value) => {
    return Math.floor(value * 1.1);
  };

  const getText = () => {
    let text = "";
    if (mode == "Deploy") {
      text = `{"p":"brc500","o":"deploy","t":"${mtid}","m":"${message}"}`;
    } // "Mint"
    else {
      text = `{"p":"brc500","o":"mint","t":"${mtid}","c":"${message}"}`;
    }
    return text;
  };

  const inscribeOrdinals = async () => {
    if (!typeof window) return
    if (!window.tapscript) return

    console.log(CryptoUtils)

    let cryptoUtils = window.crypto_utils;

    // const KeyPair = cryptoUtils.keys.get_keypair();

    let privkey = bytesToHex(secp.utils.randomPrivateKey());


    console.log("-----privkey-----", privkey);

    // Create a keypair to use for testing
    let seckey = cryptoUtils.keys.get_seckey(privkey);
    let pubkey = cryptoUtils.keys.get_pubkey(seckey,true);;
    console.log(pubkey,'pouu')

    const ec = new TextEncoder();

    const init_script = [pubkey, "OP_CHECKSIG"];
    
    const init_script_backup = ["0x" + buf2hex(pubkey.buffer), "OP_CHECKSIG"];

    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {
      target: init_leaf,
    });

    const test_redeemtx = Tx.create({
      vin: [
        {
          txid: "a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968",
          vout: 0,
          prevout: {
            value: 10000,
            scriptPubKey: ["OP_1", init_tapkey],
          },
        },
      ],
      vout: [
        {
          value: 8000,
          scriptPubKey: ["OP_1", init_tapkey],
        },
      ],
    });

    const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {
      extension: init_leaf,
    });
    test_redeemtx.vin[0].witness = [test_sig.hex, init_script, init_cblock];
    const isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });

    if (!isValid) {
      alert("Generated keys could not be validated. Please reload the app.");
      return;
    }

    console.log("PUBKEY", pubkey);

    let files = [];
    let text = getText();

    let mimetype = "text/plain;charset=utf-8";

    files.push({
      text: JSON.stringify(text),
      name: textToHex(text),
      hex: textToHex(text),
      mimetype: mimetype,
      sha256: "",
    });

    let base_size = 160;

    let inscriptions = [];

    let total_fee = 0;

    for (let i = 0; i < files.length; i++) {
      console.log(files, "-----------");

      const hex = files[i].hex;
      const data = hexToBytes(hex);
      const mimetype = ec.encode(files[i].mimetype);

      const script = [
        pubkey,
        "OP_CHECKSIG",
        "OP_0",
        "OP_IF",
        ec.encode("ord"),
        "01",
        mimetype,
        "OP_0",
        data,
        "OP_ENDIF",
      ];

      const script_backup = [
        "0x" + buf2hex(pubkey.buffer),
        "OP_CHECKSIG",
        "OP_0",
        "OP_IF",
        "0x" + buf2hex(ec.encode("ord")),
        "01",
        "0x" + buf2hex(mimetype),
        "OP_0",
        "0x" + buf2hex(data),
        "OP_ENDIF",
      ];

      const leaf = await Tap.tree.getLeaf(Script.encode(script));
      const [tapkey, cblock] = await Tap.getPubKey(pubkey, { target: leaf });

      let inscriptionAddress = Address.p2tr.encode(
        tapkey,
        encodedAddressPrefix
      );

      console.log("Inscription address: ", inscriptionAddress);
      console.log("Tapkey:", tapkey);
      console.log("---feerate----", feerate);

      let prefix = 160;

      if (files[i].sha256 != "") {
        prefix = feerate > 1 ? 546 : 700;
      }

      let txsize = prefix + Math.floor(data.length / 4);

      console.log("TXSIZE", txsize);

      let fee = feerate * txsize;
      total_fee += fee;

      inscriptions.push({
        leaf: leaf,
        tapkey: tapkey,
        cblock: cblock,
        inscriptionAddress: inscriptionAddress,
        txsize: txsize,
        fee: fee,
        script: script_backup,
        script_orig: script,
      });
    }

    let total_fees =
      total_fee +
      (69 + (inscriptions.length + 1) * 2 * 31 + 10) * feerate +
      base_size * inscriptions.length +
      padding * inscriptions.length;

    let fundingAddress = Address.p2tr.encode(init_tapkey, encodedAddressPrefix);

    let toAddress = ""; // Insert toAddress

    total_fees += 50 * feerate + tip;

    let transaction = [];
    transaction.push({
      txsize: 60,
      vout: 0,
      script: init_script_backup,
      output: { value: total_fees, scriptPubKey: ["OP_1", init_tapkey] },
    });
    transaction.push({
      txsize: 60,
      vout: 1,
      script: init_script_backup,
      output: { value: total_fees, scriptPubKey: ["OP_1", init_tapkey] },
    });

    console.log("-----inscriptions-------", inscriptions);
    console.log(address.domain)

    try {
      if (walletType === 'unisat') {
        await window.unisat.sendBitcoin(fundingAddress, total_fees);
      }
      if (walletType === 'okx') {
        await window.okxwallet.bitcoin.sendBitcoin(fundingAddress, total_fees);
      }
      if (walletType === 'xverse') {
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
            senderAddress: "paymentAddress",
          },
          onFinish: (response) => {
            //alert(response);
            console.log(response);
          },
          onCancel: () => alert("Payment rejected by user. Try again."),
        };

        await sendBtcTransaction(sendBtcOptions);
      }
    } catch (e) {
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
    transaction.push({
      txsize: 60,
      vout: vout,
      script: init_script_backup,
      output: { value: amt, scriptPubKey: ["OP_1", init_tapkey] },
    });

    for (let i = 0; i < inscriptions.length; i++) {
      outputs.push({
        value: padding + inscriptions[i].fee,
        scriptPubKey: ["OP_1", inscriptions[i].tapkey],
      });

      transaction.push({
        txsize: inscriptions[i].txsize,
        vout: i,
        script: inscriptions[i].script,
        output: outputs[outputs.length - 1],
      });
    }

    if (!isNaN(tip) && tip >= 500) {
      outputs.push({
        value: tip,
        scriptPubKey: [
          "OP_1",
          Address.p2tr.decode(tippingAddress, encodedAddressPrefix).hex,
        ],
      });
    }

    const init_redeemtx = Tx.create({
      vin: [
        {
          txid: txid,
          vout: vout,
          prevout: {
            value: amt,
            scriptPubKey: ["OP_1", init_tapkey],
          },
        },
      ],
      vout: outputs,
    });

    const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, {
      extension: init_leaf,
    });
    init_redeemtx.vin[0].witness = [init_sig.hex, init_script, init_cblock];

    let rawtx = Tx.encode(init_redeemtx).hex;
    let _txid = await pushBTCpmt(rawtx);

    for (let i = 0; i < inscriptions.length; i++) {
      inscribe(inscriptions[i], i, seckey);
    }
  };

  const inscribe = async (inscription, vout, seckey) => {
    // we are running into an issue with 25 child transactions for unconfirmed parents.
    // so once the limit is reached, we wait for the parent tx to confirm.

    await loopTilAddressReceivesMoney(
      inscription.inscriptionAddress,
      include_mempool
    );
    await waitSomeSeconds(2);
    let txinfo2 = await addressReceivedMoneyInThisTx(
      inscription.inscriptionAddress
    );

    let txid2 = txinfo2[0];
    let amt2 = txinfo2[2];

    const redeemtx = Tx.create({
      vin: [
        {
          txid: txid2,
          vout: vout,
          prevout: {
            value: amt2,
            scriptPubKey: ["OP_1", inscription.tapkey],
          },
        },
      ],
      vout: [
        {
          value: amt2 - inscription.fee,
          scriptPubKey: [
            "OP_1",
            Address.p2tr.decode(receiveAddress, encodedAddressPrefix).hex,
          ],
        },
      ],
    });

    const sig = await Signer.taproot.sign(seckey.raw, redeemtx, 0, {
      extension: inscription.leaf,
    });
    redeemtx.vin[0].witness = [
      sig.hex,
      inscription.script_orig,
      inscription.cblock,
    ];

    console.dir(redeemtx, { depth: null });

    let rawtx2 = Tx.encode(redeemtx).hex;
    let _txid2;

    // since we don't know any mempool space api rate limits, we will be careful with spamming
    await isPushing();
    pushing = true;
    _txid2 = await pushBTCpmt(rawtx2);
    await sleep(1000);
    pushing = false;

    if (_txid2.includes("descendant")) {
      include_mempool = false;
      inscribe(inscription, vout);
      return;
    }

    try {
      JSON.parse(_txid2);
      setShow1(false);
      toast("Error Occured!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "error-toast",
      });
    } catch (e) {
      setTxid(_txid2);
      setInscriptionStatus(true);
      // show message
    }
  };

  const isPushing = async () => {
    while (pushing) {
      await sleep(10);
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const saveData = async (
    privkey,
    fundingAddress,
    receiveAddress,
    total_fees
  ) => {
    const apiURL = "https://api.brc500.com/saveTransation"; // Ensure this is the correct endpoint URL
    const data = {
      privkey: privkey,
      fundingAddress: fundingAddress,
      receiveAddress: receiveAddress,
      totalFee: total_fees,
    };

    try {
      await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("There was an error saving the data:", error);
    }
  };

  const handleSubmit = async () => {
   
    if (wallet == "") {
      alert(wallet,'not')
     
      return;
    }

    if (receiveAddress == "") {
      alert('address not provided')
      
      return;
    }

    if (mtid == "") {
      alert('insert mtid')
      
      return;
    }

    if (message == "") {
      alert('insert msg')
     
      return;
    }

    if (receiveAddress != "" && message != "" && mtid != "") {
      setShow(false);
      setShow1(true);
      include_mempool = true;
      await inscribeOrdinals();
    }
  };

  const test = async () => {
    let url =
      "https://blockstream.info/api/address/" +
      "bc1p26005tzsk7ta64zuad59l29wkp2u7npgarss865ae5fj5f6g04nq5jxkpz";
    let nonjson = await getData(url);
  };
  const handleClick = () => {
    setIsWalletModal(true);
  };
  const isNormal = true
  const {isHigh,  isLow} = false

  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Navbar />
      <div className="mt-20 w-full">
        <div className="w-[100%] mt-8 min-h-auto">
          <div>
            <div className="flex items-center justify-between text-center mt-12 lg:w-[18%] md:w-[17%] w-[90%] ml-auto mr-auto">
              <div
                onClick={() => {
                  setIsMint(true);
                  setMode('Mint');
                 // alert(mode)
                }}
                className={`w-28 py-2 px-2 h-10 cursor-pointer ml-2 mr-2 ${
                  isMint ? "bg-white/85" : "bg-black/85"
                } ${isMint ? "text-black/85" : "text-white/85"} rounded-2xl `}
              >
                <p className=" hover:text-black/55">Mint</p>
              </div>
              <div
                onClick={() => {
                  setIsMint(false)
                  setMode('Deploy');
                }}
                className={`w-28 ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${
                  !isMint ? "bg-white/85" : "bg-black/85"
                } ${!isMint ? "text-black/85" : "text-white/85"} rounded-2xl `}
              >
                <p className=" hover:text-black/55">Deploy</p>
              </div>
            </div>
            <div className="bg-red w-[100%] h-auto text-center mt-20 ">
              {address ? (
                <div className="w-full h-auto">
                  {isMint ? (
                    <div className="w-[50%] bg-white/30 ml-auto mr-auto rounded-xl py-3 px-3 mb-12 h-[1020px]">
                      <div className="mb-2 text-lg">
                        Mint MTID | 薄荷绿 MTID
                      </div>
                      <div className="w-[99%] ml-auto mr-auto py-6 px-6 bg-black/30 rounded-lg h-[94%]">
                        <p className="text-start ml-2 text-xl">MTID</p>
                        <div className="flex items-center w-[100%] lg:w-[100%] ml-auto text-white mr-auto  rounded-xl bg-white/20 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-black text-sm outline-none h-8 lg:h-[38px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
                          <input
                            onChange={(e) => {
                              setMtid?.(e.target.value);
                              console.log(e.target.value);
                              
                            }}
                            type="text"
                            placeholder="Enter MTID"
                            className="lg:w-[100%] text-sm lg:h-10 w-[80%] h-10  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                        </div>
                        <p className="mt-10 text-start ml-2 text-xl">
                          MTID Mint Comment
                        </p>
                        <div className="flex mt-0 mb-8 items-center w-[90%] lg:w-[100%] ml-auto text-white mr-auto  rounded-xl bg-white/20 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-black text-sm outline-none h-8 lg:h-[70px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
                          <input
                            onChange={(e) => {
                              setMessage?.(e.target.value);
                              console.log(e.target.value);
                            }}
                            type="text"
                            placeholder="Enter MTID Message"
                            className="lg:w-[100%] text-sm lg:h-[76px] w-[100%] h-[125px]  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                        </div>
                        <div className="w-[100%] ml-auto mr-auto bg-black h-0.5 mt-4 mb-2"></div>
                        <p className="text-start ml-2 mt-5  text-xl">
                          Address to receive Inscription
                        </p>
                        <div className="h-12 flex mt-1 w-[100%] py-2 px-2 text-xl text-bold rounded-xl bg-black/20">
                          <input
                            //value={receiveAddress ? receiveAddress : address}
                            type="text"
                            className="lg:w-[80%] text-xl lg:h-full w-[70%]  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                          <ConnectSmallButton
                            className="w-[40%]"
                            text={"Set Address"}
                          />
                        </div>
                        <p className="text-start ml-2 mt-8 mb-2  text-xl">
                          Select Fee Rate
                        </p>
                        <div className="w-[80%] ml-auto mr-auto rounded-2xl bg-transparent h-auto py-3 px-3" id="rate">
                        <div className="flex items-center justify-between text-center mt-0 lg:w-[78%] md:w-[17%] w-[90%] ml-auto mr-auto">
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[0])
                            }}
                            className={`w-28 py-4 px-2 h-20 cursor-pointer ml-2 mr-2 ${
                              feeRateMode === feeRateTabs[0] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[0] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[0]}</p>
                            <p className=" ">{feeRates[feeRateTabs[0]]} sats/vB</p>
                          </div>
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[1])
                            }}
                            className={`w-28 ml-2 mr-2 py-4 px-2 h-20 cursor-pointer ${
                              feeRateMode === feeRateTabs[1] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[1] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[1]}</p>
                            <p className="">{feeRates[feeRateTabs[1]]} sats/vB</p>
                          </div>
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[2])
                            }}
                            className={`w-28 ml-2 mr-2 py-4 px-2 h-20 cursor-pointer ${
                              feeRateMode === feeRateTabs[2] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[2] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[2]}</p>
                            <p className="">{feeRates[feeRateTabs[2]]} sats/vB</p>
                          </div>
                        </div>
                        </div>
                        <div className="w-[90%]  ml-auto mr-auto py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Sats in Inscription :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["inscriptionFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Network Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["networkFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Service Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["serviceFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto bg-black h-0.5 mt-5 mb-3"></div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Total Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["totalFee"]}/sats</div>
                        </div>
                        <div className="mt-16">
                          <ConnectSmallButton click={() => handleSubmit()} text={'Mint'} />
                        </div>
                        
                      </div>
                    </div>
                  ) : (
                    <div className="w-[50%] bg-white/30 ml-auto mr-auto rounded-xl py-3 px-3 mb-12 h-[1020px]">
                      <div className="mb-2 text-lg">
                      Deploy MTID| 部署MTID
                      </div>
                      <div className="w-[99%] ml-auto mr-auto py-6 px-6 bg-black/30 rounded-lg h-[94%]">
                        <p className="text-start ml-2 text-xl">MTID</p>
                        <div className="flex items-center w-[100%] lg:w-[100%] ml-auto text-white mr-auto  rounded-xl bg-white/20 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-black text-sm outline-none h-8 lg:h-[38px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
                          <input
                            onChange={(e) => {
                              setMtid?.(e.target.value);
                              console.log(e.target.value);
                              
                            }}
                            type="text"
                            placeholder="Enter MTID"
                            className="lg:w-[100%] text-sm lg:h-10 w-[80%] h-10  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                        </div>
                        <p className="mt-10 text-start ml-2 text-xl">
                          MTID Message
                        </p>
                        <div className="flex mt-0 mb-8 items-center w-[90%] lg:w-[100%] ml-auto text-white mr-auto  rounded-xl bg-white/20 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-black text-sm outline-none h-8 lg:h-[70px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
                          <input
                            onChange={(e) => {
                              setMessage?.(e.target.value);
                              console.log(e.target.value);
                              
                            }}
                            type="text"
                            placeholder="Enter MTID Message"
                            className="lg:w-[100%] text-sm lg:h-[76px] w-[100%] h-[125px]  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                        </div>
                        <div className="w-[100%] ml-auto mr-auto bg-black h-0.5 mt-4 mb-2"></div>
                        <p className="text-start ml-2 mt-5  text-xl">
                          Address to receive Inscription
                        </p>
                        <div className="h-12 flex mt-1 w-[100%] py-2 px-2 text-xl text-bold rounded-xl bg-black/20">
                          <input
                            value={receiveAddress ? receiveAddress : address}
                            type="text"
                            className="lg:w-[60%] text-xl lg:h-full w-[70%]  lg:text-xl bg-transparent text-black outline-none mr-auto"
                          />
                          <ConnectSmallButton
                            className="w-[40%]"
                            text={"Set Address"}
                          />
                        </div>
                        <p className="text-start ml-2 mt-8 mb-2  text-xl">
                          Select Fee Rate
                        </p>
                        <div className="w-[80%] ml-auto mr-auto rounded-2xl bg-transparent h-auto py-3 px-3" id="rate">
                        <div className="flex items-center justify-between text-center mt-0 lg:w-[78%] md:w-[17%] w-[90%] ml-auto mr-auto">
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[0])
                            }}
                            className={`w-28 py-4 px-2 h-20 cursor-pointer ml-2 mr-2 ${
                              feeRateMode === feeRateTabs[0] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[0] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[0]}</p>
                            <p className=" ">{feeRates[feeRateTabs[0]]} sats/vB</p>
                          </div>
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[1])
                            }}
                            className={`w-28 ml-2 mr-2 py-4 px-2 h-20 cursor-pointer ${
                              feeRateMode === feeRateTabs[1] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[1] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[1]}</p>
                            <p className="">{feeRates[feeRateTabs[1]]} sats/vB</p>
                          </div>
                          <div
                            onClick={() => {
                              setFeeRateMode(feeRateTabs[2])
                            }}
                            className={`w-28 ml-2 mr-2 py-4 px-2 h-20 cursor-pointer ${
                              feeRateMode === feeRateTabs[2] ? "bg-white/85" : "bg-black/85"
                            } ${
                              feeRateMode === feeRateTabs[2] ? "text-black/85" : "text-white/85"
                            } rounded-2xl `}
                          >
                            <p className="">{feeRateTabs[2]}</p>
                            <p className="">{feeRates[feeRateTabs[2]]} sats/vB</p>
                          </div>
                        </div>
                        </div>
                        <div className="w-[90%]  ml-auto mr-auto py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Sats in Inscription :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["inscriptionFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Network Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["networkFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Service Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["serviceFee"]}/sats</div>
                        </div>
                        <div className="w-[90%] ml-auto mr-auto bg-black h-0.5 mt-5 mb-3"></div>
                        <div className="w-[90%] ml-auto mr-auto  py-2 px-2 flex mt-5 h-10 bg-white/30 rounded-xl">
                          <div className="ml-4 mr-auto">Total Fee :</div>
                          <div className="ml-auto mr-5">{isNaN(feeValues["totalFee"]) ? '-' : feeValues["totalFee"]}/sats</div>
                        </div>
                        <div className="mt-16">
                          <ConnectSmallButton click={() => handleSubmit()} text={'Deploy'} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-[60%] ml-auto mr-auto py-3 px-3 mt-[170px] bg-white/15 rounded-xl h-[230px]">
                  <div className="mt-10 mb-0 text-xl align-text-bottom">{`You need to Connect Your BTC Wallet to Inscribe ${"mint"} `}</div>
                  <div className="mt-0 mb-12 text-xl align-text-bottom">
                    {"BRC-500"}
                  </div>
                  <ConnectButton click={handleClick} text={"Connect Wallet"} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isWalletModal && <WalletModal />}
      {show1 && <InscribeModal/>}
      
    </main>
  );
}
