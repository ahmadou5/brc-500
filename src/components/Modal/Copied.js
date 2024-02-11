export const Copied = () => {
    return(
    <div className="inset-0 fixed bg-black/20 bg-opacity-100 w-[100%] z-[99999999] min-h-screen backdrop-blur-sm flex ">
        <div className="w-[94%] lg:w-[25%]  flex-row h-[60px] drop-shadow-glow text-center ml-auto mr-auto text-black  mt-[100px] bg-white/70 rounded-3xl flex   pt-5 mb-20 ">
            <p className="ml-auto mr-3">Address Copied to clipboard!</p>
            <img className="h-6 w-6 mr-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png" alt="verified" />
        </div>
    </div>
    )
}