import { Search } from "../Search"
export const Hero = () => {
    return(
    <div className="w-[100%] h-[270px] py-10 px-6 text-center mt-20">
        <div className="mt-28 mb-28 ">
            <p className="text-3xl text-black/85">Search For Your Ordinals</p>
            <div className="flex items-center justify-center mt-5 w-[25%] ml-auto mr-auto">
                <div className="w-28 py-1 px-1 h-11 bg-black/85 rounded-full hover:bg-white/50">
                    <img className="w-10 h-9 ml-9 lg:ml-16" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" alt="BTC"/>
                </div>
            </div>
            
        </div>
    </div>

    )
}