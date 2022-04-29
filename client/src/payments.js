import { ethers } from "ethers";
// import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


// const Toast = MySwal.mixin({
//     toast: true,
//     position: 'bottom-left',
//     iconColor: 'white',
//     customClass: {
//       popup: 'colored-toast'
//     },
//     showConfirmButton: false,
//     timer: 4000,
//     timerProgressBar: true,
//   })



    //cambios de red registrados y vuelta a la de polygon
    export function handleNewChain (chainId) {
        console.log(chainId)
        if(chainId !== "0x89"){
        MySwal.fire({
              imageUrl: 'https://raw.githubusercontent.com/MetaMask/brand-resources/c3c894bb8c460a2e9f47c07f6ef32e234190a7aa/SVG/metamask-fox.svg',
              imageWidth: 200,
              imageHeight: 200,
              imageAlt: 'Custom image',
              title: 'Alert: Chain changed',
              text: 'Please get back to polygon chain',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Switch Chain'
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                      {
                        chainId: '0x89',
                      },
                    ],
                  });
                } catch (error) {
                  MySwal.fire({
                    title: 'An error occurred while Switching!',
                    icon:'error',
                    timer: '3000',
                  })
                  setTimeout(function () {getNetworkAndChainId ()}, 3000);
                }
              }else{
                getNetworkAndChainId()
              }
            })
        }
    }
    export async function getNetworkAndChainId () {
        try {
            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            })
            handleNewChain(chainId);
            return(chainId);
        } catch (err) {
            console.error(err)
        }
    }
    
    
    
    export const isMetaMaskInstalled = () => {
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
    }
    export const isMetaMaskConnected = () => {
    return (window.ethereum.isConnected() && window.ethereum.selectedAddress );
    }




    // 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0
 
    const matic = {
        address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        abi: [
            // "function balanceOf(address _owner) external view returns (uint256 _balance)",
            "function balanceOf(address owner) view returns (uint256)",
      
            "function approve(address spender, uint256 value) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256 )",
      
            "function transfer(address to, uint256 value) returns (bool)",
            "function transferFrom(address from, address to, uint value) returns (bool)"
        ],
      };



export const makePayment2 = async (PAYMENT_WALLET, PAYMENT_AMOUNT) => {

    const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
    // const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon");
    const signer = provider.getSigner();
    const publicAddress = (await provider.send("eth_requestAccounts", []))[0];
    const contract_address = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";

    
    let walletSigner = signer;
    
    
    provider.getGasPrice().then((currentGasPrice) => {
    
        let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    
        console.log(`gas_price: ${gas_price}`)
    
    
        if (contract_address) {
    
        // general token send
    
        let contract = new ethers.Contract(contract_address, matic.abi, walletSigner);
    
    
        // How many tokens?
    
        // let numberOfTokens = ethers.utils.formatEther(PAYMENT_AMOUNT)
        let numberOfTokens = ethers.BigNumber.from(PAYMENT_AMOUNT)
    
        console.log(`numberOfTokens: ${numberOfTokens}`)
    
    
        // Send tokens
    
        contract.transfer(PAYMENT_WALLET, numberOfTokens).then((transferResult) => {
    
            console.dir(transferResult)
    
            alert("sent token")
    
        })
    
        } // ether send
    
        else {
    
        const tx = {
    
            from: publicAddress,
    
            to: PAYMENT_WALLET,
    
            value: ethers.utils.parseEther(PAYMENT_AMOUNT),
    
            nonce: window.ethersProvider.getTransactionCount(
    
            publicAddress,
    
            "latest"
    
            ),
    
            gasPrice: gas_price,
    
        }
    
        console.dir(tx)
    
        try {
    
            walletSigner.sendTransaction(tx).then((transaction) => {
    
            console.dir(transaction)
    
            alert("Send finished!")
            return true;
    
            })
    
        } catch (error) {
    
            alert("failed to send!!")
            return false;
        }
    
        }
    
    })
    
    
}
export const makePayment = async (PAYMENT_WALLET, PAYMENT_AMOUNT) => {
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
        // payDone = false;
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
                return true;
                
            }else if(receipt && receipt.status === 0){
                console.log("receipt.status == 0");
                await Swal.fire({
                    title: 'An error occurred on payment!',
                    icon:'error',
                    text: tx.hash,
                    timer: '3000',
                })
                return false;
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



export async function runVerificador(tx, provider) {
      
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
    // payDone = false;
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
            return true;
            
        }else if(receipt && receipt.status === 0){
            console.log("receipt.status == 0");
            await Swal.fire({
                title: 'An error occurred on payment!',
                icon:'error',
                text: tx.hash,
                timer: '3000',
            })
            return false;
        }
    }
    
} , 5000);
}