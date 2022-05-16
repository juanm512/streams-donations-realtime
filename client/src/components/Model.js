import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

import Monitor from "../objetos/Monitor"
import Escritorio from "../objetos/Escritorio"
import Coins from "../objetos/Coins"

import usdcLogo from '../logosImg/usdc.png';
import tetherLogo from '../logosImg/tether.png';
import axsLogo from '../logosImg/axs.png';
import bnbLogo from '../logosImg/bnb.png';
import busdLogo from '../logosImg/busd.png';
import ethLogo from '../logosImg/eth.png';
import maticLogo from '../logosImg/matic.png';
import roninLogo from '../logosImg/ronin.png';
import slpLogo from '../logosImg/slp.png';

const color = new THREE.Color()




export default function Model({ scroll, ...props }) {
  const group = useRef();
  const extras = { receiveShadow: false, castShadow: true, "material-envMapIntensity": 0 }


  useFrame((state) => {
    // console.log(group.current.children[0]) 
    group.current.children[0].children.forEach((child, index) => {
      if( window.screen.width <= 600 ){
        const et = state.clock.elapsedTime;
        child.position.x = Math.sin((et + (index) * 2000) / 2) * 15;
      }


      if(index === 0){
        // mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
        const et = state.clock.elapsedTime;

        child.position.y = 100 + Math.sin((et + (index) * 2000) / 2) * 15 + scroll.current * 1000;
        child.position.z = Math.sin((et + (index) * 2000) / 3) * 10 ;

        child.rotation.z = Math.sin((et + (index) * 2000) / 3) / 10
        child.rotation.y = Math.cos((et + (index) * 2000) / 2) / 10
      }else if (index > 0 && index < 5  ){
        // mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
        const et = state.clock.elapsedTime;

        child.position.y = -800 + Math.sin((et + (index) * 2000) / 2) * 25 + scroll.current * 2500;
        // child.position.x = Math.sin((et + (index) * 2000) / 3) * 100 ;

        child.rotation.y = Math.sin((et + (index) * 2000) / 2) / 10 - 100
        // child.rotation.x = Math.cos((et + (index) * 2000) / 2) * 1
      }else if (index > 4 && index < 9  ){
        // mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
        const et = state.clock.elapsedTime;

        child.position.y = -1200 + Math.sin((et + (index) * 2000) / 2) * 25 + scroll.current * 2500;
        // child.position.x = Math.sin((et + (index) * 2000) / 3) * 10 ;

        child.rotation.y = Math.sin((et + (index) * 2000) / 2) / 10 - 100
      }else if (index > 8 && index < 14  ){
        // mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
        const et = state.clock.elapsedTime;

        child.position.y = -1500 + Math.sin((et + (index) * 2000) / 2) * 25 + scroll.current * 2500;
        // child.position.x = Math.sin((et + (index) * 2000) / 3) * 10 ;
        child.rotation.y = Math.sin((et + (index) * 2000) / 2) / 10 - 100
        // child.rotation.x = Math.sin((et + (index) * 2000) / 3) / 10
        // child.rotation.y = Math.cos((et + (index) * 2000) / 2) / 10
      }else{
        // mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
        const et = state.clock.elapsedTime;

        child.position.y = -1000 + Math.sin((et + (index) * 2000) / 2) * 15 + scroll.current * 1000;
      }
    })
  })

  return (    
    <>
    <group 
    ref={group} 
    {...props} 
    dispose={null}>
      <group
        position={[0, 0, 10]}
        // rotation={[Math.PI / 8, -Math.PI / 12, 0.2]}
        scale={[0.02, 0.02, 0.02]}
        >

        <Escritorio name="Escritorio" extras={extras} position={[100, 0, 10]} rotation={[ -1.2, 0, 0.5]} />
        
        <Coins image={bnbLogo} name="bnbLogo" {...extras} position={[-100, 100, 100]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={busdLogo} name="busdLogo" {...extras} position={[-50, 100, 110]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={tetherLogo} name="tetherLogo" {...extras} position={[0, 100, 120]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={usdcLogo} name="usdcLogo" {...extras} position={[50, 100, 115]} rotation={[0.5, 0.75, 0.5]} />

        <Coins image={maticLogo} name="maticLogo" {...extras} position={[-100, 100, 100]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={usdcLogo} name="usdcLogo" {...extras} position={[-50, 100, 110]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={tetherLogo} name="tetherLogo" {...extras} position={[0, 100, 120]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={busdLogo} name="busdLogo" {...extras} position={[50, 100, 115]} rotation={[0.5, 0.75, 0.5]} />

        <Coins image={roninLogo} name="roninLogo" {...extras} position={[-125, 100, 100]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={axsLogo} name="axsLogo" {...extras} position={[-75, 100, 110]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={ethLogo} name="ethLogo" {...extras} position={[-25, 100, 120]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={usdcLogo} name="usdcLogo" {...extras} position={[25, 100, 115]} rotation={[0.5, 0.75, 0.5]} />
        <Coins image={slpLogo} name="slpLogo" {...extras} position={[75, 100, 115]} rotation={[0.5, 0.75, 0.5]} />
        <group position={[0, 100, 10]}>
        {/* <Monitor name="Monitor1" position={[-100, 100, 10]} scale={[300, 300, 300]}/> */}
        <Monitor name="Monitor2" position={[0, 100, 10]} scale={[1000, 1000, 1000]}/>
        {/* <Monitor name="Monitor3" position={[100, 100, 10]} scale={[300, 300, 300]}/> */}
        </group>
      </group>

      <group name="Camera" position={[-1.78, 2.04, 23.58]} rotation={[1.62, 0.01, 0.11]}>
        <PerspectiveCamera makeDefault far={100} near={0.1} fov={28} rotation={[-Math.PI / 2, 0, 0]}>
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-left={-8}
            shadow-camera-bottom={-8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            intensity={2}
            shadow-bias={-0.0001}
          />
        </PerspectiveCamera>
      </group>
    </group>
    </>

  )
}