import React, { Suspense, useRef } from "react"
import Overlay from "./Overlay"

const Home = ( ) => {
  const overlay = useRef()
  const caption = useRef()
  const scroll = useRef(0)
    return(
      <>
      <Overlay ref={overlay} caption={caption} scroll={scroll} />
      </>
    );
}

export default Home;