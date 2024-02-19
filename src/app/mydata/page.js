import { BrcContextProvider } from "@/context/context";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { formatDate, formatString, formatMString, formatAddress  } from "@/config/format";
import Image from "next/image";
import { Card, Token } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { GlobalContext } from "@/context/context";
import { WalletModal } from "@/components/Modal/WalletModal";

export default function User() {
  const { data, setData,setData2,mintData, setCopy, copy, deployData, fullData,setFullData, searchData, setSearchData, setMessage, data3, setData3, message, data2 ,setMTID } = GlobalContext()
  return (
      <main className="flex min-h-screen flex-col items-center ">
        <Navbar />
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
          { isMint1 
          ?
           <div className="flex flex-wrap w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-4 mb-2 py-6 px-6 h-auto">
            {deployData.length == 0 && <div className="text-center h-12 w-[30%] rounded-2xl bg-black/45 ml-auto mr-auto py-3 px-3">User Does not Have mint Data</div>}
            {deployData && deployData?.map((data,i) => (
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
      </main>
  );
}
