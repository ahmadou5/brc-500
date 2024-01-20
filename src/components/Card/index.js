'use client'
import { useEffect, useState } from "react";
import { GlobalContext } from "@/context/context";
import axios from "axios";
export const Card = () => {
  const [isMint, setIsMint] = useState(true);
  const toggleToken = () => {
    setIsToken(!isToken);
  }
  const { data, setData, setMessage, message, data2 ,mtid ,setMTID } = GlobalContext()
 
    
  const maxLength = 18;  
  const getMessage = async (id) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://ordinals.com/content/${id}`,
        headers: {
          Accept: "application/json",
        },
      };
      await axios.request(config).then((res => {
        setMessage(JSON.stringify(res.data.m))
        console.log(message)
      }))
    } catch (error) {
      
    }
  }
  const getMTID = async (id) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://ordinals.com/content/${id}`,
        headers: {
          Accept: "application/json",
        },
      };
      await axios.request(config).then((res => {
        setMTID(JSON.stringify(res.data.t))
        console.log(mtid)
      }))
    } catch (error) {
      
    }
  }
  useEffect(()=> {
    getMessage(data?.inscription_id);
    getMTID(data.inscription_id)
  },[])
  
  return (
    <div className="w-[100%] mt-[120px] bg-transparent py-4 px-1 h-auto">
      {
        data.length !== 0 && <div className="w-[100%] mt-[40px] bg-transparent py-4 px-1 h-auto">
          <div onClick={() => {
            setData([])
          }} className="w-[100px] h-9 rounded-full bg-black ml-auto mr-auto py-1 px-1 mb-4 text-center  text-white">Close</div>
        <div className="lg:w-[88%] w-[100%] rounded-3xl flex flex-wrap items-center justify-between ml-auto mr-auto mt-2 mb-2 py-6 px-6 h-auto bg-white/25">
          {data && data?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[330px] mt-5 mb-5 block ">
                 <div className="w-[95%] mb-2 bg-white/15 h-[260px] py-4 px-4 text-center rounded-lg ml-auto mr-auto" >
                  {` ${ message !== undefined ? message : 'Error Fetching Message'}`} <div className={`${data ? 'hidden' : 'hidden'}`}>{`${getMessage(data?.inscription_id)}`}</div>
                 </div>
                 <div className="w-[95%] ml-auto h-[40px] flex mr-auto">
                 <div className=" ml-3 mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/content/${data.id}`} >{`#${data.number}`}</a>
                </div>
                <div className=" ml-auto mr-3 lg:py-1.5 text-center py-1 px-2 rounded-xl">
                  {`${new Date(data.timestamp).toLocaleDateString()}`}
                </div>
                 </div>
              </div>
          ))}
          </div>
        </div>
      }
      { data2.length == 0 && <div className="ml-auto mr-auto w-[230px] h-14 mt-[120px] bg-black/50 py-4 text-center px-3.5 rounded-xl">Loading Ordinals</div>}
      {data2.length !== 0 &&<div className="flex items-center justify-between text-center mt-8 lg:w-[15%] md:w-[25%] w-[90%] ml-auto mr-auto">
                <div onClick={() => setIsMint(true)} className={`w-28 py-2 px-2 h-10 cursor-pointer ${isMint? 'bg-white/85':'bg-black/85'} ${isMint? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Mints</p>
                </div>
                <div onClick={() => setIsMint(false)} className={`w-28 py-2 px-2 h-10 cursor-pointer ${!isMint? 'bg-white/85':'bg-black/85'} ${!isMint? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Deploy</p>
                </div>
     </div>}
      {isMint ? (
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
       { data2.length !== 0 && <div className="lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-[8%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                MTID
              </div>
              <div className=" h-8 lg:w-[21%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                Message
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Date
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                number
              </div>
              <div className=" h-8 lg:w-[19%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                Owner
              </div>
              <div className=" h-8 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                inscription_id
              </div>
            </div>
          {data2 && data2?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[8%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  <div>{mtid ? mtid : 'loading..'}</div>  <div className={`${data ? 'hidden' : 'hidden'}`}>{`${getMTID(data?.inscription_id)}`}</div>
                </div>
                <div className=" h-9 lg:w-[21%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                <div >{message ? message : 'Loading message...'}</div>  <div className={`${data ? 'hidden' : 'hidden'}`}>{`${getMessage(data?.inscription_id)}`}</div>
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {`${new Date(data.genesis_block_time - 11).toLocaleDateString()}`}
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/inscription/${data.id}`} >{data.inscription_number}</a>
                </div>
                <div className=" h-9 lg:w-[19%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {`${data.holder.slice(0,12)}...`}
                </div>
                <div className=" h-9 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {`${data.inscription_id.slice(0,12)}...`}
                </div>
              </div>
          ))}
          </div>}
        </div>
      ) : (
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-2 h-auto">
       { data2.length !== 0 && <div className="lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-3 h-auto bg-white/25">
            <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-[8%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                MTID
              </div>
              <div className=" h-8 lg:w-[21%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[16%] bg-black/70 py-1 px-2 rounded-3xl">
                Preview
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Date
              </div>
              <div className=" h-8 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                number
              </div>
              <div className=" h-8 lg:w-[19%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                Owner
              </div>
              <div className=" h-8 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                inscription_id
              </div>
            </div>
          {data2 && data2?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[8%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {13}
                </div>
                <div className=" h-9 lg:w-[21%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                <a target="_blank" href={`https://ordinals.com/preview/${data.id}`} >{data.mime_type}</a>
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {`${new Date(data.timestamp).toLocaleDateString()}`}
                </div>
                <div className=" h-9 lg:w-[14%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  <a target="_blank" href={`https://ordinals.com/inscription/${data.id}`} >{data.number}</a>
                </div>
                <div className=" h-9 lg:w-[19%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {`${data.address.slice(0,12)}...`}
                </div>
                <div className=" h-9 lg:w-[20%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {`${data.id.slice(0,12)}...`}
                </div>
              </div>
          ))}
          </div>}
        </div>
      )}
    </div>
  );
};
