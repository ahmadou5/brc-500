import React, {useState, useEffect} from 'react'

import { GlobalContext } from '@/context/context';


export default function MyDeploys() {
    const { data, setData,setData2, searchData, setSearchData, btcAddress, address, setMessage, data3, setData3, message, data2 ,setMTID } = GlobalContext()
  
  const [ordinals, setOrdinals] = useState([]);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("d.inscriptionNumber");
  const [orderDir, setOrderDir] = useState("DESC");
  const [all, setAll] = useState(0);
  const [total, setTotal] = useState(0);
  const [mtid, setMtid] = useState("");
  const [owner, setOwner] = useState("");
  const [ordinalDatas, setOrdinalDatas] = useState([]);
  const add = "bc1pk7a8d8fam078kcnhr4lu6v6fjqs439ehdzyztzzyayaqvnpmv68q7hq20u"
  const fetchData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/deploy/mine?offset=&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;
    else
      url = `https://api.brc500.com/deploy/mine?offset=${p}&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    setAll(data.total);
    setTotal(Math.ceil(data.total / limit))
    //setOrdinalDatas(data.data);
    setSearchData(data.data)
    console.log(data.data);
  }

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

  // useEffect(() => {
  //   fetchData(mtid, wallet.nostrOrdinalsAddress, 1);
  //   setPage(1);
  // }, [])

  useEffect(() => {
    if (add != "")
    {
      setOwner(add);
      fetchData(mtid, add, 1);
      setPage(1);
    }
  }, [address])

  const handleRefresh = () =>  {
    fetchData(mtid, owner, page);
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
        {ordinalDatas.map(
          (
            data,
            index,
          ) => {
            return (
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
            );
          },
        )}
      </div>
      {
        total > 1 ? 
        <div className="w-[97%] bg-transparent 900 h-9 flex ml-auto mr-auto"> 
               <div onClick={() => prev()} className={`w-28 py-2 px-2 h-9 ml-2 mr-auto cursor-pointer bg-black  rounded-2xl `}>
                    <p className="  text-white text-center">Prev</p>
                </div>
                {`Page ${page} of ${total}`}
                <div onClick={() => next()} className={`w-28 py-2 px-2 h-9 mr-2 ml-auto cursor-pointer bg-black rounded-2xl `}>
                    <p className=" text-white text-center">Next</p>
                </div>
          </div>
        :
        <></>
      }
    </div>
  )
}
