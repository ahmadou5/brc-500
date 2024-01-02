'use client'
import { SearchButton } from "../Buttons"
import { GlobalContext } from "@/context/context";
export const Search = () => {
    const { btcAddress , setBTCAddress, setData } = GlobalContext()
    const requestBalance = () => {
        try {
            const options = {
                method: 'GET',
                headers: {accept: 'application/json', 'api-key': '142cf1b0-1ca7-11ee-bb5e-9d74c2e854ac'}
              };
              
              fetch(`https://api.geniidata.com/api/v1/orc20/address/${btcAddress}/assets`, options)
                .then(response => response.json())
                .then(response => setData(response.data.list))
                console.log(response.data.list)
        } catch (error) {
            console.log(error)
        }
      }
    return(
    <div className="bg-transparent mt-9 mb-9 flex items-center justify-center h-[80px] w-[100%]">
        <div className="flex items-center w-[100%] lg:w-[70%] ml-auto mr-auto  rounded-full bg-white/30 py-1 px-1  lg:py-3 lg:px-6 border border-gray-300 text-gray-900 text-sm outline-none h-12 lg:h-16  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
            <input onChange={(e) => {
                setBTCAddress?.(e.target.value);
                console.log(e.target.value)
                console.log(btcAddress,'BTC')
                } } type="text" placeholder="Enter Your Ordinal Address " className="lg:w-[76%] text-sm lg:h-[89%] w-[80%] h-16  lg:text-2xl bg-transparent outline-none mr-auto"  />
            <SearchButton click={requestBalance} text={'search'} className='lg:w-[20%] ml-auto' />
        </div>
    </div>
    )
}