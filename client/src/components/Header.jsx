import React from "react";
import axios from 'axios';
import { ethers } from "ethers";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { Link } from "react-router-dom";

const URL = 'https://donations-crypto.herokuapp.com/';
const MySwal = withReactContent(Swal);


const Header = ( { route } ) => {
    const [ connected, setConnected ] = React.useState(false);
    const [ user, setUser ] = React.useState(null);
    const [ token, setToken ] = React.useState();

    React.useEffect(() => {
        const tokenLS = localStorage.getItem('token');
        if (tokenLS !== "undefined" && tokenLS != null) {
            console.log("====HAY TOKEN=====", tokenLS);
            setToken(tokenLS);
        }
        // eslint-disable-next-line
      }, []);

    React.useEffect(() => {
        localStorage.setItem('token', token);
        console.log("====HAY TOKEN2=====", token);
        axios({
            url: URL + 'user',
            method: 'POST',
            data:{
                token: token
            }
        })
        .then(res => {
            if (res.data.status === "success") {
                setUser(res.data.user);
                setConnected(true);
            }
        })
        .catch(err => {
            console.log(err);
        });
    
    }, [token])
    

    const handleLogin = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
            const publicAddress = (await provider.send("eth_requestAccounts", []))[0];
            const signer = provider.getSigner();
            console.log(publicAddress);
            //4.1- Pedir el nonce para el address connectado
            const nonce = await axios.get(URL+'api/getNonce?address='+ publicAddress );
            console.log(nonce.data.nonce);
            //4.2- Realizar la firma del mensaje connel nonce pedido antes
            const mySignature = await signer.signMessage("Some custom message + nonce: " + nonce.data.nonce);
            
            
            // Send a POST request with the signature
            let result = await axios({
            method: 'post',
            url: URL+'login',
            data: {
                signature: mySignature,
                publicAddress: publicAddress
            }
            });
            
            if( result && result.data.status === 'success' ){
                setToken(result.data.cookie.jwt);
                await MySwal.fire({
                    title: 'You are connected successfully',
                    text: 'Address: ' + publicAddress,
                    icon:'success',
                    timer: '3000',
                })
                setUser(publicAddress);
                setConnected(true);
            }else{
                setToken(null);
                throw new Error('Error');
            }
        
        } catch (err) {
            console.error(err)
            MySwal.fire({
            title: 'An error occurred while connecting!',
            icon:'error',
            timer: '3000',
            })
        }
    }

    return (
        route !== "homepage" ? (
        <header className="navbar bg-base-100">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost normal-case text-xl w-24 md:w-56 left">
                    <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img src="https://cdn.lorem.space/images/pizza/.cache/150x150/pexels-horizon-content-3915857.jpg" alt="logo" />
                        </div>
                    </label>
                    <span className="invisible sm:visible">Donatelo</span>
                </Link>
            </div>
            <div className="navbar-end gap-2">
                {connected  ? (
                    <div className="dropdown dropdown-end">
                        <Link tabIndex="0" to="/profile" className="w-24 md:w-full btn btn-ghost truncate" >
                            { user }
                        </Link>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-ghost normal-case text-xl" onClick={handleLogin} >
                            Log in 
                            <div className="w-10 rounded-full ml-2">
                                <img src="https://img.icons8.com/color/48/000000/metamask-logo.png" alt="icons8 Metamask"/>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </header>
        ) : (
            <header className="absolute top-0 bg-transparent navbar md:pr-8 z-10">
            <div className="navbar-start">
            </div>

            <div className="navbar-end gap-2 ">
                {connected  ? (
                    <div className="dropdown dropdown-end">
                        <Link tabIndex="0" to="/profile" className="w-24 md:w-full btn btn-ghost truncate" >
                            { user }
                        </Link>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-ghost normal-case text-xl" onClick={handleLogin} >
                            Log in 
                            <div className="w-10 rounded-full ml-2">
                                <img src="https://img.icons8.com/color/48/000000/metamask-logo.png" alt="icons8 Metamask"/>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </header>
        )
    );
};

export default Header;