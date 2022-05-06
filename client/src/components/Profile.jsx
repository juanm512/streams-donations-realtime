import React from "react";
import axios from "axios";
import UseValidator from "../hooks/useValidator";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


const URLFrontEnd = window.location.origin;
const URL = 'https://donations-crypto.herokuapp.com/';

const Profile = () => {
    const [ name, setname ] = React.useState(null);
    const [ imageURL, setimageURL ] = React.useState(null);
    const [ description, setdescription ] = React.useState(null);
    const [ minimumAmount, setminimumAmount ] = React.useState(null);
    const [ twitch, settwitch ] = React.useState(null);
    const [ twitter, settwitter ] = React.useState(null);
    const [ instagram, setinstagram ] = React.useState(null);
    const [ youtube, setyoutube ] = React.useState(null);

    const [ donationInfo, setDonationInfo ] = React.useState(null);
    const [ user, setUser ] = React.useState(null);
    const [ token, setToken ] = React.useState();

    React.useEffect(() => {
        MySwal.fire({
            title: 'Loading data...',
            onBeforeOpen: () => {
                MySwal.showLoading()
            }
        })
        const tokenLS = localStorage.getItem('token');
        if (tokenLS !== "undefined" && tokenLS != null) {
            setToken(tokenLS);
        }
        // eslint-disable-next-line
      }, []);

    React.useEffect(() => {
        localStorage.setItem('token', token);
        setTimeout(() => {
        const tokenLS = localStorage.getItem('token');
        handleGetUser(tokenLS);
        handleGetDonations(tokenLS);
        }, 2000);
        // eslint-disable-next-line
    }, [token])


    const handleGetUser = async (tokenLS) => {
        console.log(tokenLS);
        axios({
            url: URL + 'user',
            method: 'POST',
            data:{
                token: tokenLS
            }
        })
        .then(res => {
            // console.log("=====USER=====", res.data);
            if (res.data.status === "success") {
                setUser(res.data.user);
            }
        })
        .catch(err => {
            console.log(err);
        });

       
    }
    const handleGetDonations = async (tokenLS) => {
        axios({
            url: URL + 'profile',
            method: 'POST',
            data:{
                token: tokenLS
            }
        })
        .then(res => {
            MySwal.close();
            if (res.data.status === "success") {
                setDonationInfo(res.data.donationsInfo[0]);
                setname(res.data.donationsInfo[0].name);
                setimageURL(res.data.donationsInfo[0].imageURL);
                setdescription(res.data.donationsInfo[0].description);
                setminimumAmount(res.data.donationsInfo[0].minisetminimumAmount);
                settwitch(res.data.donationsInfo[0].twitch);
                settwitter(res.data.donationsInfo[0].twitter);
                setinstagram(res.data.donationsInfo[0].instagram);
                setyoutube(res.data.donationsInfo[0].youtube);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }


    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data =form.elements;

        let newData = {
            token: localStorage.getItem('token'),
            name: data.name.value,
            wallet: data.wallet.value,
            description: data.description.value,
            imageURL: data.imageURL.value,
            minimumAmount: data.minimumAmount.value,
            twitch: data.twitch.value,
            youtube: data.youtube.value,
            twitter: data.twitter.value,
            instagram: data.instagram.value,
        }

        if(newData.name === "" || newData.wallet === "" || newData.description === "" || newData.imageURL === "" || newData.minimumAmount === "" || newData.twitch === "" || newData.youtube === "" || newData.twitter === "" || newData.instagram === ""){
            MySwal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("text", newData.name)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid name',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("textarea", newData.description)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid description',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("number", newData.minimumAmount)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid minimum amount',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.imageURL)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid image URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.twitch) && !newData.twitch.includes("twitch.tv")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid twitch URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.youtube) && !newData.youtube.includes("youtube.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid youtube URL',
                timer: 2000
            })
            return;
        }


        if(!UseValidator("url", newData.twitter) && !newData.twitter.includes("twitter.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid twitter URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.instagram) && !newData.instagram.includes("instagram.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid instagram URL',
                timer: 2000
            })
            return;
        }
        
        axios({
            url: URL + 'profile-settings',
            method: 'PUT',
            data: newData
        })
        .then(res => {
            if (res.data.status === "success") {
                setDonationInfo(newData);
                MySwal.fire({
                    type: 'success',
                    title: 'Success!',
                    text: 'Your profile has been updated!',
                    timer: 2000
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data =form.elements;

        let newData = {
            name: data.name.value,
            wallet: data.wallet.value,
            description: data.description.value,
            imageURL: data.imageURL.value,
            token: token,
            minimumAmount: data.minimumAmount.value,
            twitch: data.twitch.value,
            youtube: data.youtube.value,
            twitter: data.twitter.value,
            instagram: data.instagram.value,
        }

        if(newData.name === "" || newData.wallet === "" || newData.description === "" || newData.imageURL === "" || newData.minimumAmount === "" || newData.twitch === "" || newData.youtube === "" || newData.twitter === "" || newData.instagram === ""){
            MySwal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("text", newData.name)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid name',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("textarea", newData.description)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid description',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("number", newData.minimumAmount)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid minimum amount',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.imageURL)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid image URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.twitch) && newData.twitch.includes("twitch.tv")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid twitch URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.youtube) && newData.youtube.includes("youtube.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid youtube URL',
                timer: 2000
            })
            return;
        }


        if(!UseValidator("url", newData.twitter) && newData.twitter.includes("twitter.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid twitter URL',
                timer: 2000
            })
            return;
        }

        if(!UseValidator("url", newData.instagram) && newData.instagram.includes("instagram.com")) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid instagram URL',
                timer: 2000
            })
            return;
        }

        axios({
            url: URL + 'profile-settings',
            method: 'POST',
            data: newData
        })
        .then(res => {
            if (res.data.status === "success") {
                setDonationInfo(newData);
                MySwal.fire({
                    type: 'success',
                    title: 'Success!',
                    text: 'Your profile has been updated and we have created your links!',
                    timer: 2000
                })

            }
        })
        .catch(err => {
            console.log(err);
        });
    }


    return (
        <>
        {
            donationInfo && (
            <section className="bg-opacity-50">
                <div className="container max-w-4xl mx-auto shadow-md md:w-4/5 mt-4">
                    <div className="space-y-6 bg-stone-900 opacity-75 rounded-lg mb-16">
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Your donation link to share
                            </h2>
                            <div className="max-w-sm mx-auto md:w-2/3">
                            <div className="form-control">
                                <div className="input-group">
                                    <a href={URLFrontEnd+"/donatelo/"+donationInfo.shareLink} target="_blank" rel="noreferrer" className="p-0 btn btn-square tooltip tooltip-right" data-tip="Open in a new tab">
                                    <i className="fa-solid fa-square-up-right p-2 text-xl"></i>
                                    </a>
                                    <input type="text" value={URLFrontEnd+"/donatelo/"+donationInfo.shareLink} className="rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4  text-gray-700 shadow-sm text-base " disabled readOnly />
                                    <button onClick={()=>{const link = URLFrontEnd+"/donatelo/"+donationInfo.shareLink;navigator.clipboard.writeText(link)}} className="btn btn-square tooltip tooltip-left " data-tip="Copy to clipboard">
                                    <i className="fa-regular fa-copy text-xl"></i>
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Link to show alerts (OBS)<br/>Don't share with anyone!!!
                            </h2>
                            <div className="max-w-sm mx-auto md:w-2/3">
                            <div className="form-control">
                                <div className="input-group">
                                    <a href={URLFrontEnd+"/alerts/"+donationInfo.alertsLink} target="_blank" rel="noreferrer" className="btn btn-square tooltip tooltip-right" data-tip="Open in a new tab">
                                    <i className="fa-solid fa-square-up-right p-2 text-xl"></i>
                                    </a>
                                    <input type="text" value={URLFrontEnd+"/alerts/"+donationInfo.alertsLink} className="rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4  text-gray-700 shadow-sm text-base " disabled readOnly />
                                    <button onClick={()=>{const link = URLFrontEnd+"/alerts/"+donationInfo.alertsLink;navigator.clipboard.writeText(link)}} className="btn btn-square tooltip tooltip-left " data-tip="Copy to clipboard">
                                    <i className="fa-regular fa-copy text-xl"></i>
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {donationInfo ? (
            <section className="bg-opacity-50">
                <form onSubmit={handleUpdate} className="container max-w-4xl mx-auto shadow-md md:w-4/5 mt-4">
                    <div className="space-y-6 bg-stone-900 opacity-75 rounded-lg">
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Your wallet address
                            </h2>
                            <div className="max-w-sm mx-auto md:w-2/3">
                                <div className=" relative ">
                                    <input type="text" name="wallet" className="rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4  text-gray-700 shadow-sm text-base " disabled readOnly  value={donationInfo.wallet} />
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Name
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input value={name} onChange={ e => setname(e.target.value) } type="text" name="name" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Image URL to the alert
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                            <input value={imageURL} onChange={ e => setimageURL(e.target.value) } type="text" name="imageURL" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Description for donations
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                        <textarea value={description} onChange={ e => setdescription(e.target.value) } name="description" className="textarea textarea-bordered rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="description here..."></textarea>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Minimum amount for the alerts (in MATIC)
                                </h2>
                                <div className="max-w-sm mx-auto space-y-2 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                        <input name="minimumAmount" type="range" min="0.5" max="5" className="range" step="0.5" value={minimumAmount} onChange={ e => setminimumAmount(e.target.value) } />
                                        <div className="w-full flex justify-between text-xs px-2">
                                        <span>|0.5</span>
                                        <span>|1</span>
                                        <span>|1.5</span>
                                        <span>|2</span>
                                        <span>|2.5</span>
                                        <span>|3</span>
                                        <span>|3.5</span>
                                        <span>|4</span>
                                        <span>|4.5</span>
                                        <span>|5</span>
                                        </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Twitch channel URL
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                            <input type="text" name="twitch" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" value={twitch} onChange={ e => settwitch(e.target.value) }/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Twitter URL
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                            <input type="text" name="twitter" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" value={twitter} onChange={ e => settwitter(e.target.value) }/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Instagram URL
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                            <input type="text" name="instagram" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" value={instagram} onChange={ e => setinstagram(e.target.value) }/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                                <h2 className="max-w-sm mx-auto md:w-1/3">
                                    Youtube URL
                                </h2>
                                <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                    <div>
                                        <div className=" relative ">
                                            <input type="text" name="youtube" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" value={youtube} onChange={ e => setyoutube(e.target.value) }/>
                                        </div>
                                    </div>  
                                </div>
                            </div>

                            <hr/>
                            <div className="w-full px-4 pb-4 ml-auto text-gray-300 md:w-1/3 mx-auto">
                                <button type="submit" className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    Save settings
                                </button>
                            </div>
                    </div>
                </form>
            </section>
        ):(
            <section className="bg-opacity-50">
            <form onSubmit={handleSubmit} className="container max-w-4xl mx-auto shadow-md md:w-4/5 mt-4">
                <div className="space-y-6 bg-stone-900 opacity-75 rounded-lg">
                    <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">
                            Your wallet address
                        </h2>
                        <div className="max-w-sm mx-auto md:w-2/3">
                            <div className=" relative ">
                                <input type="text" name="wallet" className="rounded-lg border-transparent flex-1 appearance-none border w-full py-2 px-4  text-gray-700 shadow-sm text-base " disabled readOnly  value={user} />
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Name
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="name" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Name"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Image URL to the alert
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="imageURL" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Enter a gif URL from internet"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Description for donations
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                    <textarea name="description" className="textarea textarea-bordered rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Description here"></textarea>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Minimum amount for the alerts (USD)
                            </h2>
                            <div className="max-w-sm mx-auto space-y-2 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                    <input name="minimumAmount" type="range" min="0.5" max="5" className="range" step="0.5" />
                                    <div className="w-full flex justify-between text-xs px-2">
                                    <span>|0.5</span>
                                    <span>|1</span>
                                    <span>|1.5</span>
                                    <span>|2</span>
                                    <span>|2.5</span>
                                    <span>|3</span>
                                    <span>|3.5</span>
                                    <span>|4</span>
                                    <span>|4.5</span>
                                    <span>|5</span>
                                    </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Twitch channel URL
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="twitch" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Twitch URL"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Twitter URL
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="twitter" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Twitter URL"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Instagram URL
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="instagram" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Instagram URL"/>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <hr/>
                        <div className="items-center w-full p-4 space-y-4 text-gray-300 md:inline-flex md:space-y-0">
                            <h2 className="max-w-sm mx-auto md:w-1/3">
                                Youtube URL
                            </h2>
                            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                                <div>
                                    <div className=" relative ">
                                        <input type="text" name="youtube" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Youtube URL"/>
                                    </div>
                                </div>  
                            </div>
                        </div>

                        <hr/>
                        <div className="w-full px-4 pb-4 ml-auto text-gray-300 md:w-1/3 mx-auto">
                            <button type="submit" className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                Save settings
                            </button>
                        </div>
                </div>
            </form>
            </section>
        )}
    </>
    );
}

export default Profile;