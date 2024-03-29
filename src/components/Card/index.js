'use client'
import { useEffect, useState ,useCallback} from "react";
import { debounce } from 'lodash';
import { GlobalContext } from "@/context/context";
import { SearchButton } from "../Buttons";
import axios from "axios";
import { Copied } from "../Modal/Copied";
import { IoCopy } from "react-icons/io5";
import { formatDate, formatString, formatMString, formatAddress  } from "@/config/format";
export const Card = () => {
  const [isMint, setIsMint] = useState(false);
  const [isLatest, setIsLatest] = useState(true);
  const [isDeploy, setIsDeploy] = useState(false);
  
  const { data, setData,setData2,mintData, setDeployData, setMintData,   btcAddress, setBTCAddress, address,  setCopy, copy, deployData, fullData,setFullData, searchData, setSearchData, setMessage, data3, setData3, message, data2 ,setMTID } = GlobalContext()
 
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [all, setAll] = useState(0);
  const [owner, setOwner] = useState("");
  const [mtid, setMtid] = useState("");
  const [orderBy, setOrderBy] = useState("count");
  const [orderDir, setOrderDir] = useState("DESC");
  const [limit, setLimit] = useState(10);
  const [deployDatas, setDeployDatas] = useState([]);
  
  const [mpage, setMPage] = useState(1);
  const [mtotal, setMTotal] = useState(0);
  const [mall, setMAll] = useState(0);
  const [mowner, setMOwner] = useState("");
  const [mmtid, setMMtid] = useState("");
  const [orderMBy, setMOrderBy] = useState("count");
  const [orderMDir, setMOrderDir] = useState("DESC");
  const [mlimit, setmLimit] = useState(10);
  const [isMint1, setIsMint1] = useState(true);
  

 
  const Mnext = () => {
    if (mpage === mtotal) return;
 
    setMPage(mpage + 1);
    fetchMintData(mmtid, mowner, mpage + 1);
  };
 
  const Mprev = () => {
    if (mpage === 1) return;
 
    setMPage(mpage - 1);
    fetchMintData(mmtid, mowner, mpage - 1);
  };

  const debouncedMSearch = useCallback(debounce((mod, value) => {
    if (mod == 0){
      fetchMintData(value, mowner, 1);
    }
    else {
      fetchMintData(mmtid, value, 1);
    }
    setMPage(1);
  }, 300), []); 

  const handleMSearch = (mod, value) => {
    if (mod == 0){
      setMMtid(value);
    } else {
      setMOwner(value);
    }
    debouncedMSearch(mod, value);
  };

  const fetchMintData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/mint?offset=&limit=${mlimit}&owner=${o}&mtid=${t}`;
    else
      url = `https://api.brc500.com/mint?offset=${p}&limit=${mlimit}&owner=${o}&mtid=${t}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();
    console.log('dataM',data)
    setMAll(data.total);
    setMTotal(Math.ceil(data.total / mlimit))
    setData(data.data);

  }
  
  // console.log('ggger',fullData);
  const handleClick = async (position, mtid) => {
    const url = `https://api.brc500.com/address?mtid=${mtid}&position=${position}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    window.open(`https://ordinals.com/inscription/${data.inscriptionId}`, '_blank');

  }
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
        // Successfully copied to clipboard
        setCopy(true);
        setTimeout(  () => 
          setCopy(false),
          1000)
      },
      (err) => {
        // Failed to copy to clipboard
        console.error('Could not copy address: ', err);
      }
    );
  }
  const handleSort = (mod) => {
    // mod: 0 -> count : 1 -> d.origin_timestamp
    if (mod == 0)  {
      if (orderMBy == "count") {
        if ( orderMDir == "ASC" ) {
          setMOrderDir("DESC");
        }
        else
        {
          setMOrderDir("ASC");
        }
      }
      else {
        setMOrderBy("count");
        setMOrderDir("DESC");
      }
    }
    else 
    {
      if (orderMBy == "d.origin_timestamp") {
        if ( orderMDir == "ASC" ) {
          setMOrderDir("DESC");
        }
        else
        {
          setMOrderDir("ASC");
        }
      }
      else {
        setMOrderBy("d.origin_timestamp");
        setMOrderDir("DESC");
      }
    }
    setMPage(1);
  }

  const handleMCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
        // Successfully copied to clipboard
        console.log('Address copied to clipboard');
        
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
  }, [orderMBy, orderMDir])

 
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
    setData2(data.data);

  }

  useEffect(() => {
    fetchData(mtid, owner, page)
    debouncedSearch();
  }, [])

  useEffect(() => {
    fetchData(mtid, owner, page)
  }, [orderBy, orderDir])

  // down
  const [Lpage, setLPage] = useState(1);
  const [Ltotal, setLTotal] = useState(0);
  const [Lall, setLAll] = useState(0);
  const [Lowner, setLOwner] = useState("");
  const [Lmtid, setLMtid] = useState("");
  const [orderLBy, setOrderLBy] = useState("count");
  const [orderLDir, setOrderLDir] = useState("DESC");
  const [Llimit, setLLimit] = useState(10);
  

 
  const Lnext = () => {
    if (Lpage === Ltotal) return;
 
    setLPage(Lpage + 1);
    fetchLData(Lmtid, Lowner, Lpage + 1);
  };
 
  const Lprev = () => {
    if (Lpage === 1) return;
 
    setLPage(Lpage - 1);
    fetchLData(Lmtid, Lowner, Lpage - 1);
  };

  const debouncedLSearch = useCallback(debounce((mod, value) => {
    if (mod == 0){
      fetchLData(value, Lowner, 1);
    }
    else {
      fetchLData(Lmtid, value, 1);
    }
    setLPage(1);
  }, 300), []); 

  const handleLSearch = (mod, value) => {
    if (mod == 0){
      setLMtid(value);
    } else {
      setLOwner(value);
    }
    debouncedLSearch(mod, value);
  };

  const fetchLData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/mint/latest?offset=&limit=${Llimit}&owner=${o}&mtid=${t}`;
    else
      url = `https://api.brc500.com/mint/latest?offset=${p}&limit=${Llimit}&owner=${o}&mtid=${t}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    setLAll(data.total);
    setLTotal(Math.ceil(data.total / limit))
    setData3(data.data);

  }

  const handleLSort = (mod) => {
    // mod: 0 -> count : 1 -> d.origin_timestamp
    if (mod == 0)  {
      if (orderLBy == "count") {
        if ( orderLDir == "ASC" ) {
          setOrderLDir("DESC");
        }
        else
        {
          setOrderLDir("ASC");
        }
      }
      else {
        setOrderLBy("count");
        setOrderLDir("DESC");
      }
    }
    else 
    {
      if (orderLBy == "d.origin_timestamp") {
        if ( orderLDir == "ASC" ) {
          setOrderLDir("DESC");
        }
        else
        {
          setOrderLDir("ASC");
        }
      }
      else {
        setOrderLBy("d.origin_timestamp");
        setOrderLDir("DESC");
      }
    }
    setLPage(1);
  }

  

  useEffect(() => {
    fetchLData(mtid, owner, page)
  }, [])

  useEffect(() => {
    fetchLData(mtid, owner, page)
  }, [orderBy, orderDir])



 // const isMint1 = false
  
 const [m2limit, setM2Limit] = useState(8);
 const [m2page, setM2Page] = useState(1);
 const [orderm2By, setM2OrderBy] = useState("m.inscriptionNumber");
 const [orderm2Dir, setM2OrderDir] = useState("DESC");
 const [m2all, setM2All] = useState(0);
 const [m2total, setM2Total] = useState(0);
 const [m2mtid, setM2Mtid] = useState("");
 const [m2owner, setM2Owner] = useState("");
 const [ordinalm2Datas, setMOrdinal2Datas] = useState([]);

 const debouncedM2Search = useCallback(
   debounce((value) => {
     fetchM2Data(value, m2owner, 1);
     setM2Page(1);
   }, 300),
   []
 );

 const handleM2Search = (value) => {
   setM2Mtid(value);
   debouncedM2Search(value);
 };

 const fetchM2Data = async (t, o, p) => {
   let url = "";
   if (p == 1)
     url = `https://api.brc500.com/mint/mine?offset=&limit=${m2limit}&owner=${o}&mtid=${t}&orderBy=${orderm2By}&orderDir=${orderm2Dir}`;
   else
     url = `https://api.brc500.com/mint/mine?offset=${p}&limit=${m2limit}&owner=${o}&mtid=${t}&orderBy=${orderm2By}&orderDir=${orderm2Dir}`;

   // Use fetch to send the request

   let result = await fetch(url);
   let data = await result.json();

   setM2All(data.total);
   setM2Total(Math.ceil(data.total / m2limit));
   setMOrdinal2Datas(data.data);
   console.log("mint", data.data);
 };

 const m2next = () => {
   if (m2page === m2total) return;

   setM2Page(m2page + 1);
   
   fetchM2Data(m2mtid, btcAddress, m2page + 1);
 };

 const m2prev = () => {
   if (m2page === 1) return;

   setM2Page(m2page - 1);
   
   fetchM2Data(m2mtid, btcAddress, m2page - 1);
 };



 const handleM2Refresh = () => {
   fetchM2Data(m2mtid, m2owner, m2page);
 };

 const requestMInscriptionbyAddress = (address) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.brc500.com/mint/mine?offset=&limit=${limit}&owner=${address}&orderBy=${orderBy}&orderDir=${orderDir}`,
      headers: {
        Accept: "application/json",
      },
    };

    axios.request(config).then((response) => {    
    console.log('axios:mint',(response.data.data));
    setMintData(response.data.data)
    console.log(data)
     
    });
  } catch (error) {
    console.log('axios erroe',error);
  }
};
 const requestDInscriptionbyAddress = (address) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.brc500.com/deploy/mine?offset=&limit=${limit}&owner=${address}&orderBy=${orderBy}&orderDir=${orderDir}`,
      headers: {
        Accept: "application/json",
      },
    };

    axios.request(config).then((response) => {    
    console.log('axios:deploy',(response.data.data));
    setDeployData(response.data.data)
    console.log(data)
     
    });
  } catch (error) {
    console.log('axios erroe',error);
  }
};

 const handleRequest = async () => {
  try {
  console.log('address:::',btcAddress)
  requestDInscriptionbyAddress(btcAddress)
  fetchM2Data(m2mtid, btcAddress, 1);
  setM2Page(1)
  requestMInscriptionbyAddress(btcAddress)
  const half =  mintData.concat(deployData)
  setFullData(half);
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="w-[100%] mt-[120px] bg-transparent py-4 px-1 h-auto">
      <div className="bg-transparent mt-9 mb-[70px] flex items-center justify-center h-[80px] w-[100%]">
        <div className="flex items-center w-[100%] lg:w-[70%] ml-auto mr-auto  rounded-full bg-white/30 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-gray-900 text-sm outline-none h-12 lg:h-[58px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
            <input onChange={(e) => {
                setBTCAddress?.(e.target.value);
                console.log(e.target.value)
                console.log(btcAddress,'BTC')
                } } type="text" placeholder="Enter Your Ordinal Address " className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
           
            <button onClick={() => handleRequest()} className=" flex text-center text-sm flex-row ml-auto mr-auto py-1 px-1 cursor-pointer  text-white hover:bg-black/40  bg-black/85 rounded-full w-[110px]  lg:w-[220px] h-9 lg:h-[45px]"><div className="text-sm  mt-auto mb-auto font-bold ml-auto mr-auto">{'Search'}</div></button>
        </div>
    </div>
      {
        fullData && fullData.length !== 0 && <div className="w-[100%] mt-[40px] bg-transparent py-4 px-1 h-auto">
          <div onClick={() => {
           setFullData([])
          }} className="w-[100px] h-9 rounded-full bg-black ml-auto mr-auto py-1 px-1 mb-4 text-center  text-white">Close</div>
        <div className="lg:w-[88%] w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-2 mb-2 py-6 px-6 h-auto bg-white/25">
          <div>
          <div className="flex items-center justify-between text-center mt-4 lg:w-[20%] md:w-[25%] w-[90%] ml-auto mr-auto">
                <div onClick={() => {
                  setIsMint1(true)
                }} className={`w-28 py-2 px-2 h-10 cursor-pointer ml-2 mr-2 ${isMint1? 'bg-white/85':'bg-black/85'} ${isMint1? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Mints</p>
                </div>
                <div onClick={() => {
                  setIsMint1(false)
                }} className={`w-28 ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${!isMint1? 'bg-white/85':'bg-black/85'} ${!isMint1? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Deploy</p>
                </div>
          </div>
          </div>
          {isMint1 && <div className="w-[85%] ml-auto mr-auto h-12 mb-3 py-2 px-2 mt-6 rounded-full  flex bg-transparent">
              <div className="bg-transparent flex w-[40%] h-8">
              <p className=" ml-0 lg:ml-4 lg:py-1 lg:px-2">{'MTID :'}</p>
              <div className="flex items-center w-[80%] lg:w-[40%] ml- lg:ml-5 mr-  lg:mr-auto  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleM2Search?.(0,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search MTID" className="lg:w-[79%] text-sm lg:h-[84%] w-[70%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
              <div className="bg-transparent flex h-8 w-[50%]">
              
              </div>
            </div>}
          { isMint1 
          ?
           <div className="flex flex-wrap w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-4 mb-2 py-6 px-6 h-auto">
            {ordinalm2Datas.length == 0 && <div className="text-center h-12 w-[30%] rounded-2xl bg-black/45 ml-auto mr-auto py-3 px-3">User Does not Have mint Data</div>}
            {ordinalm2Datas && ordinalm2Datas?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[360px] mb-5 block ">
                 <div className="w-[95%] mb-2 bg-white/15 h-[210px]  text-center py-8 px-6 rounded-lg ml-auto mr-auto" >
                  <div className="mb-4 mt-2">{'MTID - MINT'}</div>
                  <div className="mb-2">{data.m.length > 70 ? formatMString(data.m) : data.m}</div>
                  <div className="mb-1 mt-2">{`#Rank: ${data.position}`}</div>
                  <div className="mb-1 mt-2">{`#Mint: ${data.count}`}</div>
                 </div>
                 <div className="w-[100%] ml-auto h-[40px] mt-4 mr-auto">
                 <div className="w-[100%] ml-auto  mr-auto lg:py-1.5 text-start lg:px-2  py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/content/${data.inscriptionId}`} >{`Inscription:   #${data.inscriptionNumber}`}</a>
                </div>
                <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                  {`Owner: ${formatAddress(data.owner)}`}
                </div>
                <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                  {formatDate(data.origin_timestamp)}
                </div>
               </div>
              </div>
          ))}
          {isMint1 && data.length !== 0 && <div className="w-[97%] bg-transparent 900 mt-4 h-9 flex ml-auto mr-auto"> 
               <div onClick={() => m2prev()} className={`w-28 py-2 px-2 h-9 ml-2 mr-auto cursor-pointer bg-black  rounded-2xl `}>
                    <p className="  text-white text-center">Prev</p>
                </div>
                {`Page ${m2page} of ${m2total}`}
                <div onClick={() => m2next()} className={`w-28 py-2 px-2 h-9 mr-2 ml-auto cursor-pointer bg-black rounded-2xl `}>
                    <p className=" text-white text-center">Next</p>
                </div>
          </div>}
           </div>
            :
            <div className="flex flex-wrap w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-4 mb-2 py-6 px-6 h-auto">
             {mintData.length == 0 && <div className="text-center h-12 w-[30%] rounded-2xl bg-black/45 ml-auto mr-auto py-3 px-3">User Does not Have Deploy Data</div>}
            {mintData && mintData?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[360px] mb-5 block ">
                 <div className="w-[95%] mb-2 bg-white/15 h-[210px]  text-center py-8 px-6 rounded-lg ml-auto mr-auto" >
                 <div className="mb-4 mt-2">{'MTID - Deploy'}</div>
                  <div className="mb-5">{data.m.length > 70 ? formatMString(data.m) : data.m}</div>
                  <div className="mb-1 mt-2">{`#Mint: ${data.count}`}</div>
                 </div>
                 <div className="w-[100%] ml-auto h-[40px] mr-auto">
                 <div className="w-[100%] ml-auto  mr-auto lg:py-1.5 text-start lg:px-2  py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/content/${data.inscriptionId}`} >{`Inscription:   #${data.inscriptionNumber}`}</a>
                </div>
                <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                  {`Owner: ${formatAddress(data.owner)}`}
                </div>
                <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                  {formatDate(data.origin_timestamp)}
                </div>
                 </div>
              </div>
          ))}
       
           </div>}
          
          </div>
        </div>
      }
      {data && data.length == 0 && <div className="ml-auto mr-auto w-[70%] lg:w-[500px] h-14 mt-[120px] bg-black/50 py-4 text-center px-3.5 rounded-xl">Loading Ordinals</div> }
      {data && data.length !== 0 &&<div className="flex items-center justify-between text-center mt-8 lg:w-[28%] md:w-[25%] w-[90%] ml-auto mr-auto">
                <div onClick={() => {
                  setIsMint(true);
                  setIsDeploy(false);
                  setIsLatest(false)
                }} className={`w-28 py-2 px-2 h-10 cursor-pointer ml-2 mr-2 ${isMint? 'bg-white/85':'bg-black/85'} ${isMint? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Mints</p>
                </div>
                <div onClick={() => {
                  setIsMint(false);
                  setIsDeploy(true);
                  setIsLatest(false)
                }} className={`w-28 ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${isDeploy? 'bg-white/85':'bg-black/85'} ${isDeploy? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Deploy</p>
                </div>
                <div onClick={() => {
                  setIsMint(false);
                  setIsDeploy(false);
                  setIsLatest(true)
                }} className={`w-[119px] ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${isLatest? 'bg-white/85':'bg-black/85'} ${isLatest? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Latest Mint</p>
                </div>
    </div>}
      {isMint && !isDeploy && !isLatest &&
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
       { data && <div className="lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="w-[98%] h-12 mb-3 py-2 px-2 flex bg-transparent">
              <div className="bg-transparent flex w-[40%] h-8">
              <p className=" ml-0 lg:ml-4 lg:py-1 lg:px-2">{'MTID :'}</p>
              <div className="flex items-center w-[80%] lg:w-[40%] ml- lg:ml-5 mr-  lg:mr-auto  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleMSearch?.(0,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search MTID" className="lg:w-[79%] text-sm lg:h-[84%] w-[70%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
              <div className="bg-transparent flex h-8 w-[50%]">
              <p className="py-1 px-1 ml-auto mr-3 lg:py-1 lg:px-2">{'Owner :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] lg:ml-3 ml-0 lg:mr-1 mr-0  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleMSearch?.(4,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search Owner" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
            </div>
            <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-[12%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                MTID
              </div>
              <div className=" h-8 lg:w-[15%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                Balance
              </div>
              <div className=" h-8 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                owner
              </div>
              <div className=" h-8 lg:w-[48%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Rank Of  Mint
              </div>
            </div>
          {data && data.map((data,i) =>
            
            (
             
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[12%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  <div>{data.t}</div>
                </div>
                <div className=" h-9 lg:w-[15%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                <div >{data.count}</div>  
                </div>
                <div className=" h-9 lg:w-[20%] ml-auto mr-auto flex flex-row lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  <div className="ml-auto mr-4">{formatAddress(data.owner)}</div>  <IoCopy onClick={() => handleCopy(data.owner) } className="mr-auto cursor-pointer ml-1"/>
                </div>
                <div className=" h-9 lg:w-[48%] ml-auto overflow-x-clip mr-auto gap-1 flex lg:py-2 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                 
                  {
                            data.path.split(",").map((item, index) => {
                              return (
                              <div className="w-4 ml-2 mr-2" key = {index} onClick={()=> {handleClick(item, data.t)}}><p
                                variant="small"
                                color=""
                                className=" hover:text-white text-black/80 hover:font-bold cursor-pointer "
                              >
                                {item.length > 30 ? formatString(item) : item}
                              </p></div>)
                              //return <div key={index} className=" hover:text-blue-800 hover:font-bold cursor-pointer" onClick={()=> {handleClick(item, itme.t)}}>{item}</div>
                            })
                          }
                </div>
              </div>
          ))}
          {data && data.length !== 0 && <div className="w-[97%] bg-transparent 900 h-9 flex ml-auto mr-auto"> 
               <div onClick={() => Mprev()} className={`w-28 py-2 px-2 h-9 ml-2 mr-auto cursor-pointer bg-black  rounded-2xl `}>
                    <p className="  text-white text-center">Prev</p>
                </div>
                {`Page ${mpage} of ${mtotal}`}
                <div onClick={() => Mnext()} className={`w-28 py-2 px-2 h-9 mr-2 ml-auto cursor-pointer bg-black rounded-2xl `}>
                    <p className=" text-white text-center">Next</p>
                </div>
          </div>}
          </div>}
        </div>}
        {isDeploy && !isLatest && !isMint &&
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
       { data2 && <div className="lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="w-[98%] h-12 mb-3 py-2 px-2 flex bg-transparent">
              <div className="bg-transparent flex w-[50%] h-8">
              <p className="py-1 px-1 ml-4 lg:py-1 lg:px-2">{'MTID :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-5 mr-auto  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleSearch?.(0,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search MTID" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
              <div className="bg-transparent flex h-8 w-[50%]">
              <p className="py-1 px-1 ml-auto mr-3 lg:py-1 lg:px-2">{'Owner :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-3 mr-1  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleSearch?.(4,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search Owner" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
            </div>
            <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-[10%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                MTID
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                Total #MINT
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Owner
              </div>
              <div className=" h-8 lg:w-[18%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Date
              </div>
              <div className=" h-8 lg:w-[38%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                Message
              </div>
            </div>
          {data2 && data2.map((data,i) => (
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[10%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {data.t}
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                <div>{data.count}</div>
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 flex flex-row text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                 <div className="ml-auto mr-4">{formatAddress(data.owner)}</div>  <IoCopy onClick={() => handleCopy(data.owner) } className="mr-auto cursor-pointer ml-1"/>
                </div>
                <div className=" h-9 lg:w-[18%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  { formatDate(data.origin_timestamp)}
                </div>
                <div className=" h-9 lg:w-[38%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  { data.m.length > 89 ? formatString(data.m) : data.m }
                </div>
                
              </div>
          ))}
          {data2 && data2.length !== 0 && <div className="w-[97%] bg-transparent 900 h-9 flex ml-auto mr-auto"> 
               <div onClick={() => prev()} className={`w-28 py-2 px-2 h-9 ml-2 mr-auto cursor-pointer bg-black  rounded-2xl `}>
                    <p className="  text-white text-center">Prev</p>
                </div>
                {`Page ${page} of ${total}`}
                <div onClick={() => next()} className={`w-28 py-2 px-2 h-9 mr-2 ml-auto cursor-pointer bg-black rounded-2xl `}>
                    <p className=" text-white text-center">Next</p>
                </div>
          </div>}
          </div>}
        </div>}
      {isLatest && !isMint && !isDeploy &&  
         <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
          <div className="lg:w-[95%] w-[100%] mt-2 rounded-3xl ml-auto mr-auto mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="w-[98%] h-12 mb-3 py-2 px-2 flex bg-transparent">
              <div className="bg-transparent flex w-[50%] h-8">
              <p className="py-1 px-1 ml-4 lg:py-1 lg:px-2">{'MTID :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-5 mr-auto  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleLSearch?.(0,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search MTID" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
              <div className="bg-transparent flex h-8 w-[50%]">
              <p className="py-1 px-1 ml-auto mr-3 lg:py-1 lg:px-2">{'Owner :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-3 mr-1  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleLSearch?.(4,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search Owner" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
            </div>
            <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-[10%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                MTID
              </div>
              <div className=" h-8 lg:w-[45%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                Comment
              </div>
              <div className=" h-8 lg:w-[18%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Owner
              </div>
              <div className=" h-8 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Date
              </div>
              
            </div>
          {data3 && data3?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[10%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {data.t}
                </div>
                <div className=" h-9 lg:w-[45%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  { data.m.length > 89 ? formatString(data.m) : data.m }
                </div>
                <div className=" h-9 lg:w-[18%] ml-auto mr-auto lg:py-1.5 flex flex-row text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                 <div className="ml-auto mr-4">{formatAddress(data.owner)}</div>  <IoCopy onClick={() => handleCopy(data.owner) } className="mr-auto  cursor-pointer ml-1"/>
                </div>
                <div className=" h-9 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  { formatDate(data.origin_timestamp)}
                </div>
              </div>
          ))}
          {data3 && data3.length !== 0 && <div className="w-[97%] bg-transparent 900 h-9 flex ml-auto mr-auto"> 
               <div onClick={() => Lprev()} className={`w-28 py-2 px-2 h-9 ml-2 mr-auto cursor-pointer bg-black  rounded-2xl `}>
                    <p className="  text-white text-center">Prev</p>
                </div>
                {`Page ${Lpage} of ${Ltotal}`}
                <div onClick={() => Lnext()} className={`w-28 py-2 px-2 h-9 mr-2 ml-auto cursor-pointer bg-black rounded-2xl `}>
                    <p className=" text-white text-center">Next</p>
                </div>
          </div>}
          </div>
          </div>}
          {copy && <Copied />}
    </div>
    
  );
  
};
