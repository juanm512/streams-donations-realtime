import { useParams } from "react-router-dom";
import React from "react";
import { ethers } from "ethers";
import {handleNewChain, getNetworkAndChainId, isMetaMaskInstalled} from '../payments.js';
import axios from "axios";
import io from "socket.io-client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);



const URL = 'https://donations-crypto.herokuapp.com/';
const socket = io.connect(URL);

const Streamer = () => {
    let params = useParams();
    const [ donationSettings, setDonationSettings ] = React.useState(null);
    const [ amount, setAmount ] = React.useState(0.5);
    const [ nickname, setNickname ] = React.useState();
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        axios({
            url: URL + 'donations/'+ params.uuid,
            method: 'GET',
        })
        .then(res => {
            console.log(res)
            if (res.data.status === "success") {
                setDonationSettings(res.data.donationSettings);
                setAmount(res.data.donationSettings.minimumAmount)
                joinRoom(res.data.donationSettings.shareLink);
            }else{
                setDonationSettings(null);
                setError(res.data.msg);
            }
        })
        .catch(err => {
            console.log(err);
            setError(err);
        });
        // eslint-disable-next-line
    }, []);

    
    const joinRoom = (uuid) => {
        if (uuid !== "") {
        socket.emit("join_room", uuid);
        }
    };

    const sendAlert = () => {
        const nick = nickname || "anonymous" ;
        const amountTo = amount ;
        let data = { nick, amount: amountTo }
        let room = donationSettings.shareLink;
        console.log(data, room)
        socket.emit("send_alert", {data, room });
    };


    const handleDonation = async () => {
        // return sendAlert();
        if (isMetaMaskInstalled()) {
            window.ethereum.autoRefreshOnNetworkChange = false;  
            getNetworkAndChainId();
            window.ethereum.on('chainChanged', async () => handleNewChain(await getNetworkAndChainId()) );
            if(await getNetworkAndChainId() !== "0x89"){
                return handleNewChain(await getNetworkAndChainId())
            }

          
            // if (isMetaMaskConnected()){
                // const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
                // const signer = provider.getSigner();
                // const publicAddress = (await provider.send("eth_requestAccounts", []))[0];
            await makePayment( donationSettings.wallet, amount )

            // }
          
        }else{
            MySwal.fire({
                title: 'Metamask is not installed!',
                footer:'Install metamask to log in.  <a href="https://metamask.io/">Get Metamask</a>',
                icon:'info',
                timer: '5000',
                }).then(()=>{
                window.location = 'https://metamask.io/'//metamask link
            })
        }
        // sendAlert("Juanm512", 2);
    }
    

    const makePayment = async (PAYMENT_WALLET, PAYMENT_AMOUNT) => {
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
            const signer = provider.getSigner();
            // let numberOfTokens = ethers.BigNumber.from(PAYMENT_AMOUNT)
            let numberOfTokens = ethers.utils.parseUnits(PAYMENT_AMOUNT.toString() , 18);
            console.log(numberOfTokens)
            const tx = await signer.sendTransaction({
                to: PAYMENT_WALLET,
                value: numberOfTokens
            });
            console.log(tx.hash);
        //   await Swal.fire({
        //       title: `Payment in process, we are verifying the payment. Please, don't close/refresh this window (data will be lost).`,
        //       footer: 'Tx: <a href="https://polygonscan.com/tx/' + tx.hash + '"> View on polygonscan.com</a>',
        //       icon:'info',
        //       allowOutsideClick: false,
        //       allowEscapeKey: false,
        //       allowEnterKey: false,
        //       showCancelButton: false,
        //       showDenyButton: false,
        //       didOpen: async () => {
        //         Swal.showLoading();
        let j = 0;
        let id = setInterval( async function() {
            if(j>50){
            console.log("Error: we could not confirm the transaction")
            clearInterval(id);
                await Swal.fire({
                    title: 'An error occurred on payment!',
                    icon:'error',
                    text: tx.hash,
                    timer: '3000',
                })
            }else{
                console.log(tx.hash)
                let receipt = await provider.getTransactionReceipt(tx.hash);
                console.log(receipt);
                j++;
                if( receipt && receipt.status === 1 ) {
                console.log("receipt.status == 1")
                    clearInterval(id);
                    Swal.fire({
                    title: 'Success payment',
                    footer: 'Tx: <a href="https://polygonscan.com/tx/' + tx.hash + '"> View on polygonscan.com</a>',
                    icon:'success',
                    timer: '3000',
                    })
                    return sendAlert();
                    
                }else if(receipt && receipt.status === 0){
                    console.log("receipt.status == 0");
                    await Swal.fire({
                        title: 'An error occurred on payment!',
                        icon:'error',
                        text: tx.hash,
                        timer: '3000',
                    })
                    return;
                }
            }
            
        } , 5000);
            // },
       
        // })  
                    
        
          
        }catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                footer: error,
                icon:'error',
                timer: '5000',
            })
            return;
        }
    
    }


    return (
        <div className="max-w-5xl flex items-center lg:h-screen flex-wrap mx-auto my-16 lg:my-0">
        {donationSettings ? (
            <>
            <div id="profile" className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-stone-900 opacity-75 mx-6 lg:mx-0">
            

                <div className="p-4 md:p-12 text-center lg:text-left">
                    
                    <h1 className="text-3xl font-bold pt-8 lg:pt-0">{donationSettings.name}</h1>
                    <div className={`mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-50 `}></div>
                    <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">📹 <a rel="noreferrer" target="_blank" href={"https://twitch.tv/"+donationSettings.twitch}>Go to the twitch channel</a></p>
                    <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">The minimum amount that the alerts appears on stream is: {donationSettings.minimumAmount} MATIC</p>
                    <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">If the stream is offline the alerts don't show up later!</p>
                    <p className="pt-8 text-sm">{donationSettings.description}</p>

                    <div className="pt-12 pb-8">
                    <div className="mb-4 max-w-sm mx-auto md:ml-0 space-y-2 md:w-2/3">
                            <input value={amount} onChange={(e) =>{
                                setAmount(e.target.value);
                            } } type="range" min="0.5" className="range" step="0.25" />
                            <div className="range-labels">
                                <span className="range-label range-label--min">Amount you want to send: {amount || donationSettings.minimumAmount}</span>
                            </div>
                        <div className="">
                            <div className="items-center w-full p-2 space-y-2 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm md:w-1/3">
                                    Nickname
                                </h2>
                                <div className="max-w-sm space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                        <input
                                        placeholder="empty = anonymous"
                                        onChange={(e) =>{setNickname(e.target.value)} }
                                        value={nickname}
                                        className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            
                        </div>
                    </div>  
                            


                        <button onClick={handleDonation} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full">
                        Donate with Polygon (MATIC)
                        </button> 
                    </div>

                    <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={"https://www.twitch.tv/"+donationSettings.twitch} data-tip={`@${donationSettings.twitch}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={"https://www.youtube.com/c/"+donationSettings.youtube} data-tip={`@${donationSettings.youtube}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24" ><path d="M 5.3632812 2 L 2 6.6367188 L 2 20 L 7 20 L 7 23 L 10 23 L 13 20 L 17 20 L 22 15 L 22 2 L 5.3632812 2 z M 6 4 L 20 4 L 20 13 L 17 16 L 12 16 L 9 19 L 9 16 L 6 16 L 6 4 z M 11 7 L 11 12 L 13 12 L 13 7 L 11 7 z M 16 7 L 16 12 L 18 12 L 18 7 L 16 7 z"></path></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={"https://www.instagram.com/"+donationSettings.instagram} data-tip={`@${donationSettings.instagram}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={"https://twitter.com/"+donationSettings.twitter} data-tip={`@${donationSettings.twitter}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>YouTube</title><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg></a>
                    </div>
                    

                </div>

            </div>
            
            <div className="w-full lg:w-2/5">
                <img src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${donationSettings.twitch}-1920x1080.jpg`} alt={donationSettings.name} className="object-cover rounded-none lg:rounded-lg shadow-2xl hidden lg:block max-h-full lg:h-screen" />
            </div>
            </>
            ):(
                <div className="w-full lg:w-4/5 mx-auto">
                    <h1>
                        { error ? error : "Shearching data" }
                    </h1>
                </div>

            )    
        }
        </div>

    );
}

export default Streamer;