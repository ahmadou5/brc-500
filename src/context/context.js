"use client";
import {
  ReactNode,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";

export const BrcContext = createContext({});

export const BrcContextProvider = ({children}) => {
    const [isWalletModal, setIsWalletModal] = useState(false);
    const [address, setAddress] = useState('');
    const [btcAddress, setBTCAddress] = useState('');
    const [data, setData] = useState([]);
    const [data3, setData3] = useState([]);
    const [data2, setData2] = useState([]);
    const [searchData, setSearchData] = useState([])
    const [mintData, setDeployData] = useState([])
    const [deployData, setMintData] = useState([])
    const [fullData,setFullData] = useState([])
    const [show,setShow] = useState(false)
    const [message, setMessage] = useState('')
    const [mtid, setMTID] = useState('')


    const value={
        isWalletModal,
        address,
        btcAddress,
        data,
        data3,
        data2,
        message,
        searchData,
        mtid,
        mintData,
        deployData,
        fullData,
        show,
        setShow,
        setFullData,
        setDeployData,
        setMintData,
        setIsWalletModal,
        setAddress,
        setSearchData,
        setBTCAddress,
        setData,
        setData3,
        setData2,
        setMessage,
        setMTID
    };
    return(
        <BrcContext.Provider value={value} >
            {children}
        </BrcContext.Provider>
    )
}

export const GlobalContext = () => useContext(BrcContext)