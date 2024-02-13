export const ConnectButton = ({text, click}) => {
    return (
      <div>
        <div onClick={click} className=" flex flex-row ml-auto mr-auto py-1 px-1 cursor-pointer  text-white hover:bg-black/40  bg-black/85 rounded-full  w-[58%] h-[40px]">
          <p className="text-sm  mt-auto mb-auto font-bold ml-auto mr-auto">{text}</p>
        </div>
      </div>
    );
  };  


  export const SearchButton = ({text, click}) => {
    return (
      <div>
        <div onClick={click} className=" flex flex-row ml-auto mr-auto py-1 px-1 cursor-pointer  text-white hover:bg-black/40  bg-black/85 rounded-full w-[110px]  lg:w-[220px] h-9 lg:h-[45px]">
          <p className="text-sm  mt-auto mb-auto font-bold ml-auto mr-auto">{text}</p>
        </div>
      </div>
    );
  };  


  export const ConnectSmallButton = ({text, click}) => {
    return (
      <div>
        <div onClick={click} className=" flex flex-row ml-auto mr-auto py-1.5 px-1.5 cursor-pointer  text-white hover:bg-black/40  bg-black/85 rounded-2xl lg:w-[188px]  w-[100%] h-[34px]">
          <p className="text-sm  mt-auto mb-auto font-bold ml-auto mr-auto">{text}</p>
        </div>
      </div>
    );
  };  
