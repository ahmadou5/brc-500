import { TailSpin} from 'react-loader-spinner'
export const InscribeModal = () => {
    return(
    <div className="inset-0 fixed bg-black/75 bg-opacity-100 w-[100%] z-[99999999] min-h-screen backdrop-blur-sm flex ">
        <div className="w-[90%] lg:w-[40%]  flex-col h-[380px] drop-shadow-glow text-center ml-auto mr-auto text-black  mt-[100px] bg-white/70 rounded-3xl flex   pt-5 mb-20 ">
            <div className='flex mt-6 mb-12'>
            <p className="ml-auto mr-auto ">Inscribing in Progress</p>
            </div>
            <div className='ml-auto mt-7 mb-8 mr-auto'>
            <TailSpin />
        </div>
        <div className='flex mt-5 mb-10'>
            <p className="ml-auto mr-auto text-xl">Complete the transaction on Your Wallet</p>
            </div>
        </div>
        
    </div>
    )
}