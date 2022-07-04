import React, { forwardRef } from "react";
import axios from "axios";

import ronin from "../img/ronin.png"
import bsc from "../img/bsc.png"
import polygon from "../img/polygon.png"
import stream_room from "../img/stream-room.png"
import channels from "../img/channels.png"

function fy(array){
  var count = array.length,
  randomnumber,
  temp;
  while( count ){
    randomnumber = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp
  }
};

// const URL = 'http://localhost:5000/';
const URL = 'https://donations-crypto.herokuapp.com/';

const Overlay = forwardRef(({ caption, scroll }, ref) => {
  const [streamers, setStreamers] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios({
        url: URL + 'streamers',
        method: 'GET',
    })
    .then( async (res) => {
        console.log(res)
        if (res.data.status === "success") {
          setTimeout(() => {
            handleStreamers(res.data.streamers);
          }, 2000);
        }else{
          setError(res.data.msg);
        }
    })
    .catch(err => {
        console.log(err);
        setError(err);
    });
  }, []);
  
  const handleStreamers = async (streamers) => {

    fy(streamers);

    for( let i = 0; i < 3; i++ ){
      streamers[i].name = streamers[i].twitch.split("twitch.tv/")[1];
      console.log(streamers[i].name)
      await fetch(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamers[i].name}-440x248.jpg`)
      .then(function(response) {
          console.log(response);
          if( response.redirected || response.url === "https://static-cdn.jtvnw.net/ttv-static/404_preview-440x248.jpg" === response.url ) {
            throw new Error("404");
          } else {
            console.log("200");
            streamers[i].connected = true;
            setStreamers( oldStreamers => [...oldStreamers, streamers[i]] );
          }
      })
      .catch((error) => {
        console.log(error);
        setStreamers( oldStreamers => [...oldStreamers, streamers[i]] );
      });
    }
    
  };

  return (<>
  <div
    ref={ref}
    onScroll={(e) => {
      scroll.current = e.target.scrollTop / (e.target.scrollHeight - window.innerHeight)
      caption.current.innerText = (scroll.current.toFixed(2) * 100).toString().length <= 3 ? scroll.current.toFixed(2) * 100 + "%" : (scroll.current.toFixed(2) * 100).toString().substring(0,3).replace(".","") + "%"
    }}
    className="scroll">
    <div style={{ height: "200vh", background: "rgb(83, 55, 229) " }}>
      <img src={stream_room} alt="stream_room_bg" height="100%" width={"100%"} style={{position: "absolute"}}/>
      <div className="dot md:w-2/5 font-bold">
        <h1>Donate with Crypto</h1>
        A simple way to accept donations on different chains, can be shown in stream.
        <br/>
        Sign in and create your profile!
      </div>
    </div>
    <div style={{ height: "200vh", background: "#efd512" }}>
      <div className="dot">
        <h1>Binance Smart Chain</h1>
        At Binance Smart Chain you can accept BNB, BUSD, USDT and USDC.
      </div>
      <img loading="lazy" src={bsc} alt="bsc_bg" height="100%" width={"100%"}/>
    </div>
    <div style={{ height: "200vh", background: "#b144fa"}}>
      <div className="dot">
        <h1>Polygon Chain</h1>At Polygon Chain you can receive MATIC, BUSD, USDT and USDC.
      </div>
      <img loading="lazy" src={polygon} alt="polygon_bg" height="100%" width={"100%"}/>
    </div>
    <div style={{ height: "200vh", background: "#465cf5" }}>
      <div className="dot">
        <h1>Ronin Chain</h1>In this Blockchain you can accept RON, AXS, WETH, USDC and SLP.
      </div>
      <img loading="lazy" src={ronin} alt="ronin_bg" height="100%" width={"100%"}/>
    </div>
    <div style={{ height: "100vh", background: "rgb(rgb(31, 41, 55))" }}>
      <div className="dot w-full">
        <h1>Tune some channel</h1>
      </div>
    </div>

    <div style={{ height: "100vh", background: "rgb(31, 41, 55)" }}>
      <img loading="lazy" src={channels} alt="channels_bg" height="100%" width={"100%"} style={{position: "absolute"}}/>
      {
        (streamers.length > 0 && error === null) ? (
          <div className="dot2 grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto py-8">
            {
              streamers.map( (streamer, index) => {
                return (
                  <a key={streamer.name} rel="noreferrer" target="_blank" href={"https://twitch.tv/"+streamer.name} className="basis-full sm:basis-1/2 md:basis-1/3 relative mt-8 ml-4 inline-block bg-[#9147ff] group">
                    <img 
                    src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.name}-440x248.jpg`}
                    className="w-full h-auto block relative duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[-6px] z-10" 
                    alt={streamer.name} />
                    <div className={`m-2 px-2 rounded-md absolute top-0 left-0 text-white tracking-wide font-semibold text-sm bg-[${streamer.connected ? "#ff1515e2" : "#20202050"}] duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[-6px] z-10`}>
                      {streamer.connected ? "LIVE" : "OFFLINE"}
                    </div>
                    <div className={`m-2 px-2 py-1 rounded-md absolute bottom-0 left-0 text-white tracking-wide font-semibold text-sm bg-[#20202050] duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[-6px] z-10`}>
                      {streamer.name}
                    </div>
                    <div className="w-[8px] h-[8px] absolute top-0 left-0 bg-[#9147ff] origin-top-left duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[-6px] group-hover:rotate-45 z-0"></div>
                    <div className="w-[8px] h-[8px] absolute bottom-0 right-0 bg-[#9147ff] origin-bottom-left duration-200 group-hover:translate-x-[2.5px] group-hover:translate-y-[-6px] group-hover:rotate-45 z-0"></div>
                  </a>
                )
              })
            }
          </div>
        ) : (
          <div className="dot w-full">
            <h1>{error!==null ? error : "Loading..."}</h1>
          </div>
        )
      }

    </div>

    <span className="caption" ref={caption}>
      0%
    </span>
  </div>
  </>)
  })

export default Overlay
