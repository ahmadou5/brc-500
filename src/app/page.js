import { Navbar } from "@/components/Navbar";
import { BrcContextProvider } from "@/context/context";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import { Card, Token } from "@/components/Card";
import { GlobalContext } from "@/context/context";
import { Footer } from "@/components/Footer";
import { WalletModal } from "@/components/Modal/WalletModal";
import { Loading } from "@/components/Modal/Loading";


export default function Home() {
  const { data, data2 } = GlobalContext
  return (
      <main className="flex min-h-screen flex-col items-center ">
        <Navbar />
        <Hero />
        {data2 ? <Card /> : <Loading/>}
        <Footer />
      </main>
  );
}
