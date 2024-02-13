import { BrcContextProvider } from "@/context/context";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import { Card, Token } from "@/components/Card";
import { Footer } from "@/components/Footer";
import { WalletModal } from "@/components/Modal/WalletModal";

export default function Marketplace() {
  
  return (
      <main className="flex min-h-screen flex-col items-center ">
        <Navbar />
        
      </main>
  );
}