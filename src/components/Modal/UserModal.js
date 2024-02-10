import { GlobalContext } from "@/context/context"
import { IoExit } from "react-icons/io5"
export const UserModal = () => {
    const { isWalletModal , setIsWalletModal, setShow, mintData, deployData, address, setAddress} = GlobalContext()
    return(
    <div className="inset-0 fixed bg-black/60 bg-opacity-100 w-[100%] z-[99999999] min-h-screen backdrop-blur-sm flex ">
    <div className="w-[94%] lg:w-[30%] h-auto py-2 px-2 drop-shadow-glow ml-auto mr-8 text-black  mt-[100px] bg-white/70 rounded-3xl flex flex-col  pt-5 mb-20 ">
        <div className="ml-auto mb-2 mr-4">
          <IoExit className="text-black cursor-pointer h-6 w-6" onClick={() => setShow(false)}/>
        </div>
        <div className="h-[80%] ml-auto rounded-xl mt-1 mb-4 mr-auto px-2 py-2  w-[98%] bg-black/20">
           <div className="">
            {`User: ${address}`}
           </div>
           <div className="">
            {`BTC Balance: ${0.0067555}`}
           </div>
           <div className="">
            {`Total inscription: ${56}`}
           </div>
        </div>
        <div onClick={() => { setAddress(''), setShow(false) }} className="w-[100%] cursor-pointer h-9 lg:w-[140px] flex flex-row lg:py-1.5 text-center items-center lg:px-2 ml-auto mr-auto bg-black/55 py-1 px-2 rounded-xl"><p className="ml-auto text-white mr-auto">{'Disconnect'}</p> <IoExit  className="mr-auto text-white cursor-pointer ml-auto"/></div>
    </div>
    </div>
    )
}