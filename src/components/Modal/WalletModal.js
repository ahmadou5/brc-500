import { GlobalContext } from "@/context/context"
import {getAddress} from 'sats-connect'
export const WalletModal = () => {
    const { setIsWalletModal,setAddress, address} = GlobalContext()
    const wallets = [
        {
            name: 'Unisat Wallet',
            logoUrl: 'https://www.gitbook.com/cdn-cgi/image/width=36,dpr=2,height=36,fit=contain,format=auto/https%3A%2F%2F2126146786-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FJ4NHAHIVnWQiEecvs1By%252Ficon%252FLCxttftJ8BHboA7PLsfL%252Ftwitter%2520PFP%2520800x800%2520px.png%3Falt%3Dmedia%26token%3Dbcf931af-88e1-41ca-b576-3efc1b6ec166',
            downloadurl: ''
        },
        {
            name: 'Xverse Wallet',
            logoUrl: 'https://pbs.twimg.com/profile_images/1735901386381144064/o1_zB5Jf_400x400.png',
            downloadurl: ''
        }
    ]
    const UnisatConnect = async () => {
        if(typeof window.unisat !== undefined) {
            console.log('akwae')
        }
        try {
            const accounts = await window.unisat.requestAccounts();
            const res = await window.unisat.getAccounts();
            await setAddress(res);
            console.log('connect success', accounts);
            console.log(res,address)
          } catch (e) {
            console.log('connect failed');
          }
    }
    const XverseConnect = async ()  => {
        const getAddressOptions = {
            payload: {
              purposes: ['ordinals', 'payment'],
              message: 'Address for receiving Ordinals and payments',
              network: {
                type:'Mainnet'
              },
            },
            onFinish: (response) => {
              console.log(response);
              setAddress(response.addresses)
            },
            onCancel: () => alert('Request canceled'),
            }
              
          await getAddress(getAddressOptions);
    }
    return (
    <div className="inset-0 fixed bg-black/35 bg-opacity-30 w-[100%] z-[99999999] min-h-screen backdrop-blur-sm flex justify-center items-center">
        <div className="w-[94%] lg:w-[40%] h-auto py-3 px-3 drop-shadow-glow ml-auto mr-auto text-black  mt-[80px] bg-white/80 rounded-3xl flex flex-col  pt-5 mb-20 ">
            <div className=" w-[95%] ml-auto mr-auto flex h-12 mb-4 py-4 px-4">
                <p className="text-xl ml-0 mr-auto">Connect Your Wallet </p>
                <div className="text-xl mr-0 ml-auto">
                <div onClick={() => setIsWalletModal?.(false)} className='w-8 h-8 py-1.5 px-1 hover:bg-black/60 cursor-pointer rounded-lg bg-black/30'>
                
                </div>
                </div>
            </div>
            <div className="w-[95%] ml-auto mr-auto h-auto  mb-4 py-4 px-4">
            <div className="w-[100%] h-14 ml-auto mr-auto">
                <div onClick={() => UnisatConnect()} className="flex mt-1 mb-1 py-2 px-2 rounded-xl border cursor-pointer border-black/45">
                    <img className="w-8 h-8 ml-5 mr-8 rounded-xl" src={'https://www.gitbook.com/cdn-cgi/image/width=36,dpr=2,height=36,fit=contain,format=auto/https%3A%2F%2F2126146786-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FJ4NHAHIVnWQiEecvs1By%252Ficon%252FLCxttftJ8BHboA7PLsfL%252Ftwitter%2520PFP%2520800x800%2520px.png%3Falt%3Dmedia%26token%3Dbcf931af-88e1-41ca-b576-3efc1b6ec166'} alt={'unisat'} />
                    <p className="py-1 px-1 font-semibold text-md">{'Unisat Wallet'}</p>
                </div>
            </div>
            { /** <div className="w-[100%] h-14 ml-auto mr-auto">
                <div onClick={() => XverseConnect()} className="flex mt-1 mb-1 py-2 px-2 rounded-xl border cursor-pointer border-black/45">
                    <img className="w-8 h-8 ml-5 mr-8 rounded-xl" src={'https://pbs.twimg.com/profile_images/1735901386381144064/o1_zB5Jf_400x400.png'} alt={'Xverse'} />
                    <p className="py-1 px-1 font-semibold text-md">{'Xverse Wallet'}</p>
                </div>
    </div> **/ }
            </div>
        </div>
    </div>
    )
}