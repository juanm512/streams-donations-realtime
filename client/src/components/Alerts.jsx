import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import io from "socket.io-client";

const URL = 'https://donations-crypto.herokuapp.com/';
// const URL = 'http://localhost:5000/';
const socket = io.connect(URL);


const Alerts = () => {
  let params = useParams();
    const [ donationSettings, setDonationSettings ] = React.useState(null);
    const [ error, setError ] = React.useState(null);
    const [ messageReceived, setMessageReceived ] =  React.useState([]);
    const [ currentMessage, setCurrentMessage ] =  React.useState(null);

    React.useEffect(() => {
      let main = document.getElementsByTagName('main')[0];
      main.style.backgroundColor = '#00ff00';
      main.removeAttribute('class');
        axios({
            url: URL + 'alerts/'+ params.uuid,
            method: 'GET',
        })
        .then(res => {
            // console.log(res)
            if (res.data.status === "success") {
                setDonationSettings(res.data.donationSettings);
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

        setInterval(() => {
          console.log('time!');
          setCurrentMessage(null);
          runAlert();
        }, 10000);

        // eslint-disable-next-line
    }, []);
  
    // React.useEffect(() => {
    //   // if( currentMessage && responsiveVoice?.voiceSupport()) {
    //     // responsiveVoice.setDefaultVoice("Spanish Latin American Male");
    //     // responsiveVoice.speak(currentMessage.title + " " + currentMessage.message, "Spanish Latin American Male", {pitch: 1, rate: 1, volume: 1});
    //     // setTimeout(()=>{
    //     //   responsiveVoice.cancel();
    //     // },8000)
    //   // }else if (currentMessage && window.speechSynthesis) {
    //   if (currentMessage && window.speechSynthesis) {
    //     var msg = new SpeechSynthesisUtterance(currentMessage.title);
    //     msg.volume = 0.8; // From 0 to 1
    //     msg.rate = 0.75; // From 0.1 to 10
    //     msg.pitch = 1; // From 0 to 2
    //     msg.lang = 'es';
    //     msg.onend = function() {
    //       var msg = new SpeechSynthesisUtterance(currentMessage.message);
    //       msg.volume = 0.8; // From 0 to 1
    //       msg.rate = 0.75; // From 0.1 to 10
    //       msg.pitch = 1; // From 0 to 2
    //       msg.lang = 'es';
    //       window.speechSynthesis.speak(msg);
    //     }
    //     window.speechSynthesis.speak(msg);
    //     setTimeout(()=>{msg.pause()},8000)
    //   }
    // }, [currentMessage]);

  const joinRoom = (uuid) => {
    if (uuid !== "") {
      socket.emit("join_room", uuid);
    }
  };

  const runAlert = () => {
    console.log("runAlert");      
    setTimeout(() => {
      setMessageReceived((oldMessageReceived) =>{
      setCurrentMessage(oldMessageReceived.shift());
        return [...oldMessageReceived];
      });
    }, 500);
    
    // eslint-disable-next-line
  };

  React.useEffect(() => {
    socket.on("receive_alert", (data) => {
      const newAlert = data.data;
      setMessageReceived(oldMessageReceived => [...oldMessageReceived, newAlert]);
    });
    // eslint-disable-next-line
  }, [socket]);


  return (
    <>
    {(donationSettings && currentMessage ) ? (
      
    <div data-key={currentMessage.nick} className="bg-transparent min-h-screen min-w-screen pt-32">
        <div className="text-center mb-4">
            <div className="block relative">
                <img alt="profil" src={donationSettings.imageURL} className="mx-auto object-cover h-72 w-86"/>
            </div>
        </div>
        <div className="text-center">
            <p className="text-4xl text-white">
            <span className="bold text-5xl text-red-400 max-w-md">{currentMessage.title}</span>
            <br/>
            <span className="bold text-2xl text-red-700">{currentMessage.message}</span>
            </p>
        </div>
    </div>
    ):(
      <div className="bg-transparent min-h-screen min-w-screen pt-32">
        <p> {error && error}</p>
      </div>
    )}
    <script src="https://code.responsivevoice.org/responsivevoice.js?key=Ys0ZdP89"></script>
    </>
  );
}
export default Alerts;