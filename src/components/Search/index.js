'use client'
import { SearchButton } from "../Buttons"
import { useState } from "react";
import axios  from "axios";
import { GlobalContext } from "@/context/context";
import { useEffect } from "react";
import { calculateSizeAdjustValues } from "next/dist/server/font-utils";
export const Search = () => {

  const [mtid, setMtid] = useState("");
  const [orderBy, setOrderBy] = useState("count");
  const [orderDir, setOrderDir] = useState("DESC");
  const [limit, setLimit] = useState(10);
    const { btcAddress , setBTCAddress, setData,data, setSearchData, setData2 } = GlobalContext()
    const requestMintInscriptionr = () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.brc500.com/mint?limit=${20}&owner=${btcAddress}`,
          headers: {
            Accept: "application/json",
          },
        };

        axios.request(config).then((response) => {
         // setData(response.data.results);
          setSearchData(response.data.data)
          console.log('addresss',response.data.data)
        });
      } catch (error) {
        console.log('axios erroe',error);
      }
    };

    const requestDeployInscription = () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://api.brc500.com/deploy?offset=&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}",
          headers: {
            Accept: "application/json",
          },
        };

        axios.request(config).then((response) => {
         // setData(response.data.results);
          setData2(response.data.data)
          console.log(response)
        });
      } catch (error) {
        console.log('axios erroe',error);
      }
    };

    

    const requestInscriptionbyAddress = () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.brc500.com/deploy?offset=&limit=${limit}&owner=${btcAddress}&orderBy=${orderBy}&orderDir=${orderDir}`,
          headers: {
            Accept: "application/json",
          },
        };

        axios.request(config).then((response) => {    
        console.log('axios',(response.data.data));
        setSearchData(response.data.data)
        console.log(data)
         
        });
      } catch (error) {
        console.log('axios erroe',error);
      }
    };
    
      
    return(
    <div className="bg-transparent mt-9 mb-9 flex items-center justify-center h-[80px] w-[100%]">
        <div className="flex items-center w-[100%] lg:w-[70%] ml-auto mr-auto  rounded-full bg-white/30 py-1 px-1  lg:py-3 lg:px-4 border border-gray-300 text-gray-900 text-sm outline-none h-12 lg:h-[58px]  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
            <input onChange={(e) => {
                setBTCAddress?.(e.target.value);
                console.log(e.target.value)
                console.log(btcAddress,'BTC')
                } } type="text" placeholder="Enter Your Ordinal Address " className="lg:w-[79%] text-sm lg:h-[84%] w-[80%] h-16  lg:text-xl bg-transparent outline-none mr-auto"  />
            <SearchButton click={requestInscriptionbyAddress} text={'search'} className='lg:w-[20%] ml-auto' />
        </div>
    </div>
    )
}