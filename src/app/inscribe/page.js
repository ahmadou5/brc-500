
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import { Card, Token } from "@/components/Card";
import { GlobalContext } from "@/context/context";
import { Footer } from "@/components/Footer";
import { WalletModal } from "@/components/Modal/WalletModal";

export default function Inscribe() {

  
  return (
      <main className="flex min-h-screen flex-col items-center ">
        <Navbar />
        <div className="mt-[400px] text-3xl">inscribe Page Coming Soon Stay Active</div>
      </main>
  );
}
