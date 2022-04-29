import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import io from "socket.io-client";

const URL = 'https://donations-crypto.herokuapp.com/';
const socket = io.connect(URL);


const Alerts = () => {
  let params = useParams();
    const [ donationSettings, setDonationSettings ] = React.useState(null);
    const [ error, setError ] = React.useState(null);
    const [ messageReceived, setMessageReceived ] =  React.useState([]);

    React.useEffect(() => {
      let main = document.getElementsByTagName('main')[0];
      main.style.backgroundColor = '#00ff00';
      main.removeAttribute('class');
        axios({
            url: URL + 'alerts/'+ params.uuid,
            method: 'GET',
        })
        .then(res => {
            console.log(res)
            if (res.data.status === "success") {
                setDonationSettings(res.data.donationSettings);
                // setRoom(params.uuid);
                joinRoom(res.data.donationSettings.shareLink);
                setInterval(() => {
                    setMessageReceived((oldMessageReceived) =>{
                    oldMessageReceived.shift ();
                    return [...oldMessageReceived]
                    });
                }, 10000);
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

  React.useEffect(() => {
    socket.on("receive_alert", (data) => {
      const newAlert = data.data;
      setMessageReceived(oldMessageReceived => [...oldMessageReceived, newAlert]);
    });
    // eslint-disable-next-line
  }, [socket]);


  return (
    /* && (messageReceived[0].amount >= donationSettings.minimumAmount) ) */
    (donationSettings && messageReceived[0] ) ? (
    <div className="bg-transparent min-h-screen min-w-screen pt-32">
      <div data-key={messageReceived[0].nick} className="fade-in-fwd">
        <img src={donationSettings.imageURL} alt="imageURL" className="relative mx-auto w-86 h-72" />
        <p className="relative mx-auto w-2/4 h-56 text-5xl text-white">{messageReceived[0].nick} send you {messageReceived[0].amount} MATIC</p>
      </div>
    </div>
    ):(
      <div className="bg-transparent min-h-screen min-w-screen pt-32">
        <p> {error && error}</p>
      </div>
    )
  );
}
export default Alerts;