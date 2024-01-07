'use client'
import { SearchButton } from "../Buttons"
import axios  from "axios";
import { GlobalContext } from "@/context/context";
import { useEffect } from "react";
import { calculateSizeAdjustValues } from "next/dist/server/font-utils";
export const Search = () => {
    const { btcAddress , setBTCAddress, setData,data, setData2 } = GlobalContext()
    const requestInscription = () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://api.hiro.so/ordinals/v1/inscriptions?mime_type=text%2Fplain",
          headers: {
            Accept: "application/json",
          },
        };

        axios.request(config).then((response) => {
          console.log('axios',JSON.stringify(response.data.results));
          setData2(response.data.results)
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
          url: `https://api.hiro.so/ordinals/v1/inscriptions?address=${btcAddress}`,
          headers: {
            Accept: "application/json",
          },
        };

        axios.request(config).then((response) => {
            if(btcAddress === undefined) {
              alert("Please enter a valid BTC address")
              setData([])
              setBTCAddress('')
            }
          console.log('axios',JSON.stringify(response.data));
          setData(response.data.results)
        });
      } catch (error) {
        console.log('axios erroe',error);
      }
    };
    useEffect(() => {
        requestInscription()
        
        
    },[])
      
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