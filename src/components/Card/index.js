'use client'
import { useState } from "react";
import { GlobalContext } from "@/context/context";
export const Card = () => {
  const [isToken, setIsToken] = useState(true);
  const toggleToken = () => {
    setIsToken(!isToken);
  }
  const { data } = GlobalContext()
 
  const data3 = [
    {
        name: 'Goa',
        type: 'BRC20',
        balance: 300000,
        inId: 654332,
        inTy: 'Im Buying Some Shitty Gold and stufss like that'
    },
    {
        name: 'Goa',
        type: 'BRC20',
        balance: 300000,
        inId: 654332,
        inTy: 'Im Buying Some Shitty Gold and stufss like that'
    },
    {
        name: 'Goa',
        type: 'BRC20',
        balance: 300000,
        inId: 654332,
        inTy: 'Im Buying Some Shitty Gold and stufss like that'
    },
    {
        name: 'Goa',
        type: 'BRC20',
        balance: 300000,
        inId: 654332,
        inTy: 'Im Buying Some Shitty Gold and stufss like that'
    },
    {
        name: 'Chennai',
        type: 'BRC20',
        balance: 5000,
        inId: 624332,
        inTy: 'Im Buying Some Shitty diamond and stufss like that'
    },
  ]
  return (
    <div className="w-[100%] mt-[120px] bg-transparent py-4 px-2 h-auto">
     <div className="flex items-center justify-between text-center mt-8 lg:w-[15%] md:w-[25%] w-[90%] ml-auto mr-auto">
                <div onClick={() => setIsToken(true)} className={`w-28 py-2 px-2 h-10 cursor-pointer ${isToken? 'bg-white/85':'bg-black/85'} ${isToken? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">Tokens</p>
                </div>
                <div onClick={() => setIsToken(false)} className={`w-28 py-2 px-2 h-10 cursor-pointer ${!isToken? 'bg-white/85':'bg-black/85'} ${!isToken? 'text-black/85':'text-white/85'} rounded-2xl `}>
                    <p className=" hover:text-black/55">inscription</p>
                </div>
     </div>
      {isToken ? (
        <div className="w-[100%] mt-[40px] bg-transparent py-4 px-4 h-auto">
        <div className="lg:w-[85%] w-[100%] rounded-3xl ml-auto mr-auto mt-2 mb-2 py-6 px-6 h-auto bg-white/25">
           { data.length !== 0 && <div className="text-white flex items-center justify-between">
              <div className=" h-8 lg:w-32 ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Ticker
              </div>
              <div className=" h-8 lg:w-32 ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-1 px-2 rounded-3xl">
                Tag
              </div>
              <div className=" h-8 lg:w-32 ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                Balance
              </div>
              <div className=" h-8 lg:w-32 ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-black/70 py-0.5 px-0.5 rounded-3xl">
                Available
              </div>
            </div>}
          {data && data?.map((data,i) => (
             <div key={i}  className="text-black/95 mt-5 mb-5 flex items-center justify-between">
                <div className=" h-9 lg:w-[24%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {data.tick}
                </div>
                <div className=" h-9 lg:w-[24%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-1 px-2 rounded-xl">
                  {'BRC-20'}
                </div>
                <div className=" h-9 lg:w-[24%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {data.balance}
                </div>
                <div className=" h-9 lg:w-[24%] ml-auto mr-auto lg:py-1.5 text-center lg:px-2 w-[24%] bg-white/25 py-0.5 px-0.5 rounded-xl">
                  {data.balance}
                </div>
              </div>
          ))}
          </div>
        </div>
      ) : (
        <div className="w-[80%] flex flex-wrap mt-[100px] items-center justify-around bg-transparent h-auto text-black py-2 px-1 ml-auto mr-auto">
          {
            data && data?.map((data, i) => (
                <div key={i} className="lg:w-[40%] w-[96%] rounded-3xl ml-2 mr-2 py-2 px-2 mt-4 mb-6 h-[280px] bg-white/25">
            <div className="w-[95%] ml-auto mr-auto py-2 text-pretty px-1 bg- h-[85%]">
              {data.inscription_id}
            </div>
            <div className="w-[95%] ml-auto mr-auto py-1 px-1 text-lg text-center rounded-2xl  bg-white/25">
              {`#${data.inscription_number}`}
            </div>
          </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
