import React from "react";
import axios from "axios";
import io from "socket.io-client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

import NetworksInfo from "./alertsComponents/NetworksInfo";
import searchCurrencyName from "../hooks/searchCurrencyName";
import getLogos from "../hooks/getLogos";
import UseValidator from "../hooks/useValidator";
import {handleNewChain, getNetworkAndChainId, isMetaMaskInstalled} from '../payments.js';

import { bscContract } from "../contracts/bscContracts";
import { polygonContract } from "../contracts/polygonContracts";
import { roninContract } from "../contracts/roninContracts";

const MySwal = withReactContent(Swal);
(function(){
    function decimalAdjust(type, value, exp) {
		// Si el exp es indefinido o cero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// Si el valor no es un número o el exp no es un entero...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Cambio
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Volver a cambiar
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}
    Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
    };
})();

// const URL = 'https://donations-crypto.herokuapp.com/';
const URL = 'http://localhost:5000/';
const socket = io.connect(URL);

const Streamer = () => {
    let params = useParams();

    const [ donationSettings, setDonationSettings ] = React.useState(null);
    const [error, setError] = React.useState(null);

    const [ donationStep, setDonationStep ] = React.useState(false);
    
    const [ nickname, setNickname ] = React.useState();
    const [ message, setMessage ] = React.useState();
    const [ amount, setAmount ] = React.useState(0.5);
    const [ network, setNetwork ] = React.useState(null);
    const [ currency, setCurrency ] = React.useState();
    const [ price, setPrice ] = React.useState(null);
    
    const [ contract, setContract ] = React.useState(null);

    React.useEffect(() => {
        MySwal.fire({
            title: 'Loading data...',
            onBeforeOpen: () => {
                MySwal.showLoading()
            }
        })
        axios({
            url: URL + 'donations/'+ params.uuid,
            method: 'GET',
        })
        .then( async (res) => {
            console.log(res)
            MySwal.close();
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
            MySwal.close();
            console.log(err);
            setError(err);
        });

        //setear si metamask esta instalado, la red en la que esta actualmente
        if(isMetaMaskInstalled()){
            setTimeout(() => {
                handleNetwork();
                //setear el cambio de redes
                window.ethereum.autoRefreshOnNetworkChange = true;
                window.ethereum.on('chainChanged', async () => handleNetwork() );
            }, 1000);
        }


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
        let data = { nick, title: `Hey! ${nick} send you ${Math.round10(amountTo, -3).toString().replace(".",",")} ${currency} on ${network.name}`, message: message || ""  }
        let room = donationSettings.shareLink;
        console.log(data, room)
        socket.emit("send_alert", {data, room });
    };


    const handleDonation = async () => {

        if( nickname !== "" || amount === 0 || message !== "" ){
            if( nickname !== "" && !UseValidator("text", nickname)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter a valid nickname',
                    timer: 2000
                })
                return;
            }
            if(!UseValidator("textarea", message)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter a valid message, it can contain only letters, numbers, spaces and commas',
                    timer: 2000
                })
                return;
            }
            if(!UseValidator("number", amount)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter a valid amount',
                    timer: 2000
                })
                return;
            }
        }
        // return sendAlert();
        const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
        const signer = provider.getSigner();
        const publicAddress = (await provider.send("eth_requestAccounts", []))[0];
        // await makePayment( donationSettings.wallet, 0.001, provider, publicAddress, signer )
        await makePayment( donationSettings.wallet, amount, provider, publicAddress, signer )

    }
    
    const makePayment = async (PAYMENT_WALLET, PAYMENT_AMOUNT, provider, address, signer) => {
        try{
            // let numberOfTokens = ethers.BigNumber.from(PAYMENT_AMOUNT)
            let tx;
            if(contract === null){
                let numberOfTokens = ethers.utils.parseUnits(PAYMENT_AMOUNT.toString() , 18);
                console.log(numberOfTokens, PAYMENT_AMOUNT, PAYMENT_WALLET)
                let transaction = await signer.sendTransaction({
                    from: address,
                    to: PAYMENT_WALLET,
                    value: numberOfTokens
                });
                console.log(transaction.hash);
                tx = transaction;
            }else{
                let paymentContract = new ethers.Contract(contract.address, contract.abi, signer);
                // let numberOfTokens = ethers.BigNumber.from(PAYMENT_AMOUNT.toString());
                // let numberOfTokens = ethers.utils.parseUnits(PAYMENT_AMOUNT , contract.decimals);
                let numberOfTokens = ethers.utils.parseUnits(Math.round10(PAYMENT_AMOUNT, contract.decimals === 0 ? 0 : -contract.decimals).toString() , contract.decimals);
                // let numberOfTokens = Math.round10(PAYMENT_AMOUNT, contract.decimals === 0 ? 0 : -contract.decimals);
                console.log(numberOfTokens, PAYMENT_AMOUNT, PAYMENT_WALLET);
                let transferResult = await paymentContract.transfer(PAYMENT_WALLET, numberOfTokens);
                console.log(transferResult);
                tx.hash = transferResult.hash;
            }

            await MySwal.fire({
            title: `Payment in process, we are verifying the payment. Please, don't close/refresh this window (data will be lost).`,
            footer: <p>Tx: <a rel="noreferrer" target="_blank" href={network.blockExplorer+"/"+ tx.hash}> View on {network.blockExplorer}</a></p>,
            icon:'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            showDenyButton: false,
            didOpen: async () => {
                Swal.showLoading();

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
                            MySwal.fire({
                            title: 'Success payment',
                            footer: <p>Tx: <a rel="noreferrer" target="_blank" href={network.blockExplorer+"/"+ tx.hash}> View on {network.blockExplorer}</a></p>,
                            icon:'success',
                            timer: '10000',
                            })
                            // if(donationSettings.minimumAmount <= amount/price ){
                                return sendAlert();
                            // }
                            
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
            },
   
            });  
          
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

    const handleNetworksInfo = async () => {
        MySwal.fire({
            title: 'Networks info',
            icon:'info',
            width: '85%',
            html: <NetworksInfo />
        })
    }

    const handleNetwork = async () => {
        const currentNetId = parseInt(await getNetworkAndChainId());
        let currentRPC;
        if( bscContract.RPC.ChainIDHex === currentNetId ){
            currentRPC = bscContract.RPC;
        }else if( polygonContract.RPC.ChainIDHex === currentNetId ){
            currentRPC = polygonContract.RPC;
        }else if( roninContract.RPC.ChainIDHex === currentNetId ){
            currentRPC = roninContract.RPC;
        }else{
            setNetwork(null);
            MySwal.fire({
                icon: 'error', 
                title: "Network not supported!",
                html: <p>
                        Supported networks are: BSC, POLYGON or RONIN.
                        <br/>
                        <button className="link text-bold text-lg" onClick={handleNetworksInfo}>
                            See supported networks information
                        </button>.
                    </p>,
            });
        }
        setNetwork({name: currentRPC.chainName, id: currentNetId, currencys: currentRPC.currencys, blockExplorer: currentRPC.chainExplorer});
        handleCurrency(currentRPC.chainSymbol);
        setPrice(null)
        setAmount(null);
        setNickname("");
        setMessage("");

        MySwal.fire({
            icon: 'success',
            title: 'Network changed to: ' + currentRPC.chainName,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })
    }

    const handleCurrency = async (curren) => {
        const currenName = await searchCurrencyName(curren);
        setCurrency(curren);
        MySwal.fire({
            icon: 'success',
            title: 'Currency changed to: ' + curren,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })
        // const KEY = "AC3A198D-875E-4580-BB13-55C98050701A";
        // axios.get(`https://rest.coinapi.io/v1/exchangerate/${curren}/USD`)
        axios.get(`https://api.coingecko.com/api/v3/coins/${currenName}`)
        .then(({data}) => {
            // console.log(data);
            setPrice(data.market_data.current_price.usd);
            setAmount(0.5/data.market_data.current_price.usd);
            handleContract(curren);
        })
        .catch(err => {
            console.log(err);
            setDonationStep(false);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: "failed to get currency price",
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            })
        })
    }

    const handleContract = async (curren) => {
        if(curren === "BNB" || curren === "RON" || curren === "MATIC"){
            setContract(null);
        }else{
            if(network.name === "BSC"){
                setContract(bscContract[curren.toLowerCase()+"ABI"]);
            } else if(network.name === "POLYGON") { 
                setContract(polygonContract[curren.toLowerCase()+"ABI"]);
            }else if( network.name === "RONIN") {
                setContract(roninContract[curren.toLowerCase()+"ABI"]);
            }else{
                setContract(null);
            }
        }
    }

    return (
        <div className="max-w-5xl flex items-center lg:h-screen flex-wrap mx-auto my-16 lg:my-0">
        {donationSettings ? (
            <>
            <div id="profile" className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-stone-900 opacity-75 mx-6 lg:mx-0">
            

                <div className="p-4 md:px-12 md:py-8 text-center lg:text-left">
                    
                    
                    {!donationStep ? (
                        <>
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">{donationSettings.name}</h1>
                        <div className={`mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-50 `}></div>
                        <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">📹 <a rel="noreferrer" target="_blank" href={"https://twitch.tv/"+donationSettings.twitch}>Go to the twitch channel</a></p>
                        <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">The minimum amount that the alerts appears on stream is: {donationSettings.minimumAmount} USD</p>
                        <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">If the stream is offline the alerts don't show up later!</p>
                        <p className="pt-8 text-sm">{donationSettings.description}</p>
                        {!isMetaMaskInstalled ? (
                            <div className="pt-12 pb-8">
                                <div className="alert alert-error shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>
                                            <strong>Error!</strong> You need to install MetaMask to use this service. 
                                        </span>
                                    </div>
                                </div>
                            </div>
                            ) : (
                                network !== null &&
                            <div className="pt-12 pb-8">
                                <button onClick={() =>setDonationStep(true)} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full">
                                    Go to the donation step
                                </button>
                            </div>
                            )}
                    </>
                    ) : (
                    <div className="pt-2 pb-2">
                        <div className="mb-0 max-w-full mx-auto md:ml-0 space-y-2 md:w-6/7 disabled">
                            <div className="flex flex-col">
                                <span>
                                    <strong>Select the crypto you want!</strong> (network currency is selected by default)
                                    <br/>
                                    <small>Minimum amount to appear on stream: {donationSettings.minimumAmount} USD</small>
                                </span>
                                <div className="btn-group flex justify-center lg:justify-start mx-auto mt-1">
                                    {
                                        network.currencys.map((cur, index) => (
                                            <button key={index+cur} onClick={() => handleCurrency(cur)} className={`btn w-20 h-20 btn-outline-secondary ${cur === currency ? "btn-primary" : "btn-neutral"}`}>{getLogos(cur)} {cur}</button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {(currency !== null && price !== null ) ? (
                                    <>
                                    <input value={amount || 0.5/price} onChange={(e) =>{
                                        setAmount(e.target.value);
                                    } } type="range" min={0.5/price} max={100/price} className="range" step="0.00001" />
                                    <div className="range-labels">
                                        <span className="range-label range-label--min">Amount you want to send: {Math.round10(amount, -3)===0 ? Math.round10(amount, -5) : Math.round10(amount, -3)} {currency} - {Math.round10(amount * price, -3)} USD </span>
                                    </div>
                                    </>
                                    ) : (
                                        <span>Loading...</span>
                                    )
                                }
                            </div>

                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/4">
                                    Nickname
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-3/4">
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
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/4">
                                    Alert message
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-3/4">
                                    <div>
                                        <div className=" relative ">
                                        <textarea 
                                        placeholder="Optional! Write a message that appears on the stream alert"
                                        onChange={(e) =>{setMessage(e.target.value)} }
                                        value={message}
                                        className="textarea textarea-bordered rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent">
                                        </textarea>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                                
                        </div>  

                        <button onClick={handleDonation} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full">
                        Make donation ( {Math.round10(amount, -3)===0 ? Math.round10(amount, -5) : Math.round10(amount, -3) + currency} - {network.name} )
                        </button> 
                    </div>
                            
                    )}
                    
                    <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={donationSettings.twitch} data-tip={`@${donationSettings.twitch.split("/").pop()}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={donationSettings.youtube} data-tip={`@${donationSettings.youtube.split("/").pop()}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24" ><path d="M 5.3632812 2 L 2 6.6367188 L 2 20 L 7 20 L 7 23 L 10 23 L 13 20 L 17 20 L 22 15 L 22 2 L 5.3632812 2 z M 6 4 L 20 4 L 20 13 L 17 16 L 12 16 L 9 19 L 9 16 L 6 16 L 6 4 z M 11 7 L 11 12 L 13 12 L 13 7 L 11 7 z M 16 7 L 16 12 L 18 12 L 18 7 L 16 7 z"></path></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={donationSettings.instagram} data-tip={`@${donationSettings.instagram.split("/").pop()}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
                        <a rel="noreferrer" target="_blank" className="link tooltip tooltip-bottom tooltip-info" href={donationSettings.twitter} data-tip={`@${donationSettings.twitter.split("/").pop()}`}><svg className="h-6 fill-current text-gray-600 hover:text-green-700" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>YouTube</title><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg></a>
                    </div>
                    

                </div>

            </div>
            
            <div className="w-full lg:w-2/5">
                <img src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${donationSettings.twitch.split("/").pop()}-1920x1080.jpg`} alt={donationSettings.name} className="object-cover rounded-none lg:rounded-lg shadow-2xl hidden lg:block max-h-full lg:h-screen" />
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