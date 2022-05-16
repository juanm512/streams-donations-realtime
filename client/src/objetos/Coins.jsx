import { useRef } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useFrame, useLoader, useThree } from "@react-three/fiber"

function Coins(props) {
    const colorMap = useLoader(TextureLoader, props.image)

    const coin = useRef()

    // useFrame((state) => {
    //   const et = state.clock.elapsedTime;
    //   coin.current.position.y = Math.sin((et + (1) * 2000) / 2) * 15;
    //   // coin.current.rotation.y = Math.cos((et + (1) * 2000) / 2) * 0.2;
    // })

    return (
      <group ref={coin} position={props.position} scale={[0.75, 0.75, 0.75]} rotation={props.rotation} >
      <mesh
        {...props}
        scale={1}
        >
        <cylinderGeometry args={[ 40, 40, 2, 64]} />
        <meshBasicMaterial reflectivity={1} map={colorMap} />
      </mesh>
      </group>
    )
}


export default Coins;