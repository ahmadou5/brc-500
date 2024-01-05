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
    const [data2, setData2] = useState([]);
    const [loading, setLoading] = useState(false)


    const value={
        isWalletModal,
        address,
        btcAddress,
        data,
        data2,
        setIsWalletModal,
        setAddress,
        setBTCAddress,
        setData,
        setData2
    };
    return(
        <BrcContext.Provider value={value} >
            {children}
        </BrcContext.Provider>
    )
}

export const GlobalContext = () => useContext(BrcContext)