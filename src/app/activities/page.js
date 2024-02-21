"use client";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useCallback } from "react";
import { Footer } from "@/components/Footer";
import { debounce } from "lodash";
import { GlobalContext } from "@/context/context";
import {
  formatDate,
  formatString,
  formatMString,
  formatAddress,
} from "@/config/format";

export default function Activities() {
  const {
    data,
    setData,
    setData2,
    mintData,
    setCopy,
    address,
    copy,
    deployData,
    fullData,
    setFullData,
    searchData,
    setSearchData,
    setMessage,
    data3,
    setData3,
    message,
    data2,
    setMTID,
  } = GlobalContext();

  const [isMint1, setIsMint] = useState(true);
  // const wallet = useSelector(state => state.wallet);
  const [ordinals, setOrdinals] = useState([]);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("d.inscriptionNumber");
  const [orderDir, setOrderDir] = useState("DESC");
  const [all, setAll] = useState(0);
  const [total, setTotal] = useState(0);
  const [mtid, setMtid] = useState("");
  const [owner, setOwner] = useState("");
  const [ordinalDatas, setOrdinalDatas] = useState([]);

  const fetchData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/deploy/mine?offset=&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;
    else
      url = `https://api.brc500.com/deploy/mine?offset=${p}&limit=${limit}&owner=${o}&mtid=${t}&orderBy=${orderBy}&orderDir=${orderDir}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    setAll(data.total);
    setTotal(Math.ceil(data.total / limit));
    setOrdinalDatas(data.data);
    console.log("deploy", data.data);
  };

  const next = () => {
    if (page === total) return;

    setPage(page + 1);
    fetchData(mtid, owner, page + 1);
  };

  const prev = () => {
    if (page === 1) return;

    setPage(page - 1);
    fetchData(mtid, owner, page - 1);
  };

  // useEffect(() => {
  //   fetchData(mtid, wallet.nostrOrdinalsAddress, 1);
  //   setPage(1);
  // }, [])

  useEffect(() => {
    if (address != "") {
      setOwner(address);
      fetchData(mtid, address, 1);
      setPage(1);
    }
  }, [address]);

  const handleRefresh = () => {
    fetchData(mtid, owner, page);
  };
  // const [ordinals, setOrdinals] = useState([]);

  // const [ordinals, setOrdinals] = useState([]);
  const [mlimit, setMLimit] = useState(12);
  const [mpage, setMPage] = useState(1);
  const [ordermBy, setMOrderBy] = useState("m.inscriptionNumber");
  const [ordermDir, setMOrderDir] = useState("DESC");
  const [mall, setMAll] = useState(0);
  const [mtotal, setMTotal] = useState(0);
  const [mmtid, setMMtid] = useState("");
  const [mowner, setMOwner] = useState("");
  const [ordinalmDatas, setMOrdinalDatas] = useState([]);

  const debouncedMSearch = useCallback(
    debounce((value) => {
      fetchMData(value, owner, 1);
      setMPage(1);
    }, 300),
    []
  );

  const handleSearch = (value) => {
    setMMtid(value);
    debouncedMSearch(value);
  };

  const fetchMData = async (t, o, p) => {
    let url = "";
    if (p == 1)
      url = `https://api.brc500.com/mint/mine?offset=&limit=${mlimit}&owner=${o}&mtid=${t}&orderBy=${ordermBy}&orderDir=${ordermDir}`;
    else
      url = `https://api.brc500.com/mint/mine?offset=${p}&limit=${mlimit}&owner=${o}&mtid=${t}&orderBy=${ordermBy}&orderDir=${ordermDir}`;

    // Use fetch to send the request

    let result = await fetch(url);
    let data = await result.json();

    setMAll(data.total);
    setMTotal(Math.ceil(data.total / mlimit));
    setMOrdinalDatas(data.data);
    console.log("mint", data.data);
  };

  const mnext = () => {
    if (mpage === mtotal) return;

    setMPage(mpage + 1);
    fetchMData(mmtid, mowner, mpage + 1);
  };

  const mprev = () => {
    if (mpage === 1) return;

    setMPage(mpage - 1);
    fetchMData(mmtid, mowner, mpage - 1);
  };

  // useEffect(() => {
  //   fetchData(mtid, wallet.nostrOrdinalsAddress, 1);
  //   setPage(1);
  // }, [])

  useEffect(() => {
    if (address != "") {
      setOwner(address);
      fetchMData(mmtid, address, 1);
      setMPage(1);
    }
  }, [address]);

  const handleMRefresh = () => {
    fetchMData(mtid, owner, page);
  };
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Navbar />
      <div className="mt-20 w-[100%]">
        <div className="flex mt-[70px] items-center justify-between text-center lg:w-[18%] md:w-[17%] w-[90%] ml-auto mr-auto">
          <div
            onClick={() => setIsMint(true)}
            className={`w-28 py-2 px-2 h-10 cursor-pointer ml-2 mr-2 ${
              isMint1 ? "bg-white/85" : "bg-black/85"
            } ${isMint1 ? "text-black/85" : "text-white/85"} rounded-2xl `}
          >
            <p className=" hover:text-black/55">Mint</p>
          </div>
          <div
            onClick={() => setIsMint(false)}
            className={`w-28 ml-2 mr-2 py-2 px-2 h-10 cursor-pointer ${
              !isMint1 ? "bg-white/85" : "bg-black/85"
            } ${!isMint1 ? "text-black/85" : "text-white/85"} rounded-2xl `}
          >
            <p className=" hover:text-black/55">Deploy</p>
          </div>
        </div>
        <div className=" lg:w-[95%] w-[100%] rounded-3xl ml-auto mr-auto mt-10 mb-2 py-6 px-3 h-auto bg-white/25">
          {isMint1 ? (
            <div>
              {/**<div className="rounded-2xl bg-black/40  ml-auto mr-auto flex w-[30%] h-12 py-1 px-1">
          <p className="mt-1.5 ml-0 lg:ml-4 lg:py-1 lg:px-2">
            {"MTID :"}
          </p>
          <div className="flex items-center w-[80%] mt-1 lg:w-[40%] ml- lg:ml-auto mr-  lg:mr-2   rounded-full bg-black/30 py-1 px-1  lg:py-1 lg:px-2 border border-gray-300 text-gray-900 text-sm outline-none h-8 lg:h-8  focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-white/30 dark:border-black/40 dark:placeholder-gray-400 dark:text-black/50 dark:focus:ring-green-500 dark:focus:border-green-500/70">
            <input
              onChange={(e) => {
                handleSearch?.(0, e.target.value);
                console.log(e.target.value);
              }}
              type="text"
              placeholder="Search MTID"
              className="lg:w-[79%] text-sm lg:h-[100%] w-[70%] h-16  lg:text-xl bg-transparent outline-none mr-auto"
            />
          </div>
            </div>**/}{" "}
            </div>
          ) : (
            <></>
          )}
          {isMint1 ? (
            <div className="flex flex-wrap w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-0 mb-2 py-6 px-6 h-auto">
              {ordinalmDatas?.length == 0 && (
                <div className="text-center mt-[120px] h-[130px] py-12 px-12 w-[30%] rounded-2xl bg-black/45 ml-auto mr-auto">
                  User Does not Have mint Data
                </div>
              )}
              {ordinalmDatas &&
                ordinalmDatas?.map((data, i) => (
                  <div
                    key={i}
                    className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[410px] mb-5 block "
                  >
                    <div className="w-[95%] mb-0 bg-white/15 h-[210px]  text-center py-8 px-6 rounded-lg ml-auto mr-auto">
                      <div className="mb-4 mt-2">{"MTID - MINT"}</div>
                      <div className="mb-2">
                        {data.m.length > 70 ? formatMString(data.m) : data.m}
                      </div>
                      <div className="mb-1 mt-2">{`#Rank: ${data.position}`}</div>
                      <div className="mb-1 mt-2">{`#Mint: ${data.count}`}</div>
                    </div>
                    <div className="w-[100%] ml-auto h-[40px] mt-4 mr-auto">
                      <div className="w-[100%] ml-auto  mr-auto lg:py-1.5 text-start lg:px-2  py-1 px-2 rounded-xl">
                        <a
                          target="_blank"
                          href={`https://ordinals.com/content/${data.inscriptionId}`}
                        >{`Inscription:   #${data.inscriptionNumber}`}</a>
                      </div>
                      <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                        {`Owner: ${formatAddress(data.owner)}`}
                      </div>
                      <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                        {formatDate(data.origin_timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-wrap w-[100%] rounded-3xl  items-center justify-between ml-auto mr-auto mt-4 mb-2 py-6 px-6 h-auto">
              {ordinalDatas?.length === 0 && (
                <div className="text-center mt-[120px] h-[130px] py-12 px-12 w-[30%] rounded-2xl bg-black/45 ml-auto mr-auto">
                  User Does not Have Deploy Data
                </div>
              )}
              {ordinalDatas &&
                ordinalDatas?.map((data, i) => (
                  <div
                    key={i}
                    className="text-black/95 mt-2 bg-white/15 py-2 px-2 w-[24%] rounded-xl ml- h-[360px] mb-5 block "
                  >
                    <div className="w-[95%] mb-5 bg-white/15 h-[210px]  text-center py-8 px-6 rounded-lg ml-auto mr-auto">
                      <div className="mb-4 mt-2">{"MTID - Deploy"}</div>
                      <div className="mb-5">
                        {data.m.length > 70 ? formatMString(data.m) : data.m}
                      </div>
                      <div className="mb-1 mt-2">{`#Mint: ${data.count}`}</div>
                    </div>
                    <div className="w-[100%] ml-auto h-[40px] mr-auto">
                      <div className="w-[100%] ml-auto  mr-auto lg:py-1.5 text-start lg:px-2  py-1 px-2 rounded-xl">
                        <a
                          target="_blank"
                          href={`https://ordinals.com/content/${data.inscriptionId}`}
                        >{`Inscription:   #${data.inscriptionNumber}`}</a>
                      </div>
                      <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                        {`Owner: ${formatAddress(data.owner)}`}
                      </div>
                      <div className="w-[100%] ml-auto mr-auto mt-1 lg:py-0.5 text-start py-1 px-2 rounded-xl">
                        {formatDate(data.origin_timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
