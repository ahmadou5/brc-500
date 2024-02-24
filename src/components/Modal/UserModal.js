import { GlobalContext } from "@/context/context";
import { IoExit, IoCopy } from "react-icons/io5";
import { formatAddress } from "@/config/format";
import axios  from "axios";
import { Copied } from "./Copied";
import { useEffect, useState } from "react";
export const UserModal = () => {
  const [mint,setMint] = useState([])
  const [deploy,setDeploy] = useState([])
  const {
    isWalletModal,
    setIsWalletModal,
    setShow,
    mintData,
    deployData,
    address,
    balance,
    copy,
    setCopy,
    setAddress,
  } = GlobalContext();
  const requestDInscriptionbyAddress = (address) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.brc500.com/deploy/mine?owner=${address}`,
        headers: {
          Accept: "application/json",
        },
      };

      axios.request(config).then((response) => {    
      console.log('axios:deploy',(response.data.data));
      setDeploy(response.data.data)
      //console.log(data)
       
      });
    } catch (error) {
      console.log('axios erroe',error);
    }
  };

  const requestMInscriptionbyAddress = (address) => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.brc500.com/mint/mine?owner=${address}`,
        headers: {
          Accept: "application/json",
        },
      };

      axios.request(config).then((response) => {    
      console.log('axios:mint',(response.data.data));
      setMint(response.data.data)
      //console.log(data)
       
      });
    } catch (error) {
      console.log('axios erroe',error);
    }

   
  };
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
        // Successfully copied to clipboard
        setCopy(true);
        setTimeout(  () => 
          setCopy(false),
          1100)
      },
      (err) => {
        // Failed to copy to clipboard
        console.error('Could not copy address: ', err);
      }
    );
  }
  useEffect(() => {
    requestDInscriptionbyAddress(address);
    requestMInscriptionbyAddress(address);
},[])
  return (
    <div className="inset-0 fixed bg-black/60 bg-opacity-100 w-[100%] z-[99999999] min-h-screen backdrop-blur-sm flex ">
      <div className="w-[94%]  lg:w-[25%] h-[400px] py-2 px-2 drop-shadow-glow ml-auto mr-8 text-black  mt-[100px] bg-white/70 rounded-3xl flex flex-col  pt-5 mb-20 ">
        <div className="ml-auto mb-2 mr-4">
          <div  onClick={() => setShow(false)} className="w-20 h-8 text-white text-center py-1 px-2 bg-black rounded-3xl">
             Close
          </div>
         
        </div>
        <div className="h-[80%] ml-auto rounded-xl mt-1 mb-4 mr-auto px-2 py-2  w-[98%] ">
          <div className="flex py-0.5 px-2 mb-3 bg-black/60 rounded-full">
            <img
              src="./nbtc.png"
              alt="user"
              className="w-8 h-8 ml-1 mt-2.5 mr-auto rounded-full"
            />
            <div className="py-3 flex px-3 ml-auto mr-auto text-balance text-xl">
              {" "}
              {` ${formatAddress(address.toString())}`}{" "}
              <IoCopy className="mr-2 ml-2" onClick={() => {
                handleCopy(address);
                setShow(false)
                }} />
            </div>
          </div>
          <div className="flex  py-3 px-2 mb-2  rounded-full">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
              alt="user"
              className="w-8 h-8 ml-1 mt-4 mr-10 rounded-full"
            />
            <div className=" flex flex-col ml-3 mr-auto text-balance text-xl">
              {" "}
              <div>{`Confirmed: ${parseInt(balance?.confirmed)}`}{" "}</div>
              <div>{`UnConfirmed: ${balance?.unconfirmed}`}{" "}</div>
              <div>{`Total Balance: ${balance?.total}`}{" "}</div>
            </div>
          </div>
          <div className="flex mt-2 py-1 px-1">
            <div className="flex ml-auto mr-auto rounded-full py-1 px-1">
              <div className="py-2  flex px-2 ml-auto mr-auto text-balance text-xl">
                {" "}
                {`Total Mints: ${mint.length}`}{" "}
              </div>
            </div>
            <div className="flex py-1 ml-auto rounded-full mr-auto px-1">
              <div className="py-2  flex px-2 ml-auto mr-auto text-balance text-xl">
                {" "}
                {`Total Deploys: ${deploy.length}`}{" "}
              </div>
            </div>
          </div>
          
        </div>
        <div
          onClick={() => {
            setAddress(""), setShow(false);
          }}
          className="w-[100%] cursor-pointer mb-10 h-9 lg:w-[140px] flex flex-row lg:py-1.5 text-center items-center lg:px-2 ml-auto mr-auto bg-black/55 py-1 px-2 rounded-xl"
        >
          <p className="ml-auto text-white mr-auto">{"Disconnect"}</p>{" "}
          <IoExit className="mr-auto text-white cursor-pointer ml-auto" />
        </div>
      </div>
      {copy && <Copied />}
    </div>
  );
};
