'use client'
import { useEffect, useState ,useCallback} from "react";
import { debounce } from 'lodash';
import { GlobalContext } from "@/context/context";
import axios from "axios";
import { IoCopy } from "react-icons/io5";
import { formatDate, formatString, formatAddress , handleCopy } from "@/config/format";
export const Card = () => {
  const [isMint, setIsMint] = useState(true);
  const toggleToken = () => {
    setIsToken(!isToken);
  }
  const { data, setData,setData2, searchData, setSearchData, setMessage, message, data2 ,setMTID } = GlobalContext()
 
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

  
    
  
   

  return (
    <div className="w-[100%] mt-[120px] bg-transparent py-4 px-1 h-auto">
      {
        searchData && searchData.length !== 0 && <div className="w-[100%] mt-[40px] bg-transparent py-4 px-1 h-auto">
          <div onClick={() => {
            setSearchData([])
          }} className="w-[100px] h-9 rounded-full bg-black ml-auto mr-auto py-1 px-1 mb-4 text-center  text-white">Close</div>
        <div className="lg:w-[88%] w-[100%] rounded-3xl flex flex-wrap items-center justify-between ml-auto mr-auto mt-2 mb-2 py-6 px-6 h-auto bg-white/25">
          {searchData && searchData?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[330px] mt-5 mb-5 block ">
                 <div className="w-[95%] mb-2 bg-white/15 h-[230px] py-4 px-4 text-center rounded-lg ml-auto mr-auto" >
                  {data.m.length > 70 ? formatString(data.m) : data.m}
                 </div>
                 <div className="w-[100%] ml-auto h-[40px] mr-auto">
                 <div className="w-[100%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2  py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/content/${data.inscriptionId}`} >{`#${data.inscriptionNumber}`}</a>
                </div>
                <div className="w-[100%] ml-auto mr-auto lg:py-1.5 text-center py-1 px-2 rounded-xl">
                  {formatDate(data.origin_timestamp)}
                </div>
                 </div>
              </div>
          ))}
          </div>
        </div>
      }
      {data && data.length == 0 && <div className="ml-auto mr-auto w-[230px] h-14 mt-[120px] bg-black/50 py-4 text-center px-3.5 rounded-xl">Loading Ordinals</div> }
      {data && data.length !== 0 &&<div className="flex items-center justify-between text-center mt-8 lg:w-[15%] md:w-[25%] w-[90%] ml-auto mr-auto">
                <div onClick={() => setIsMint(true)} className={`w-28 py-2 px-2 h-10 cursor-pointer ml-2 mr-2 ${isMint? 'bg-white/85':'bg-black/85'} ${isMint? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Mints</p>
                </div>
                <div onClick={() => setIsMint(false)} className={`w-28 ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${!isMint? 'bg-white/85':'bg-black/85'} ${!isMint? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Deploy</p>
                </div>
    </div>}
      {isMint ? (
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
       { data && <div className="lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="w-[98%] h-12 mb-3 py-2 px-2 flex bg-transparent">
              <div className="bg-transparent flex w-[50%] h-8">
              <p className="py-1 px-1 ml-4 lg:py-1 lg:px-2">{'MTID :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-5 mr-auto  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
              <input onChange={(e) => {
                handleMSearch?.(0,e.target.value);
                console.log(e.target.value)
                
                } } type="text" placeholder="Search MTID" className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
               </div>
              </div>
              <div className="bg-transparent flex h-8 w-[50%]">
              <p className="py-1 px-1 ml-auto mr-3 lg:py-1 lg:px-2">{'Owner :'}</p>
              <div className="flex items-center w-[100%] lg:w-[40%] ml-3 mr-1  rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
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
                <div className=" h-9 lg:w-[48%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {data?.path.length > 70 ? formatString(data.path) : data.path}
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
        </div>
      ) : (
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
          {data2 && data2?.map((data,i) => (
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
        </div>
      )}
    </div>
  );
};
