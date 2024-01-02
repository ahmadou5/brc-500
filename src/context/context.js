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


    const value={
        isWalletModal,
        address,
        btcAddress,
        data,
        setIsWalletModal,
        setAddress,
        setBTCAddress,
        setData
    };
    return(
        <BrcContext.Provider value={value} >
            {children}
        </BrcContext.Provider>
    )
}

export const GlobalContext = () => useContext(BrcContext)