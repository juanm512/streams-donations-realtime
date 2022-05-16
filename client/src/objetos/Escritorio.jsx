import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef } from 'react';
import * as THREE from "three";
const color = new THREE.Color();

export default function Escritorio(props) {
    const mesh = useRef();
    // const { nodes, materials } = useLoader(GLTFLoader, '/low_poly_computer_desk/scene.gltf')
    const { nodes, materials } = useLoader(GLTFLoader, '/scene.glb')

    useFrame(({ state }) => {
        mesh.current.material.color.lerp(color.set("#202020").convertSRGBToLinear(), 0.05);
    });

    return(
        <group {...props}>
            <group rotation={[Math.PI / 2, 0, 0]}>
            {/* <group position={[76.1, 75, 39.7]} scale={[0.1, 0.1, 0.1]}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Paper2_ComputerDesk_0.geometry}
                // material={nodes.Paper2_ComputerDesk_0.material}
                />
            </group>
            <group position={[34.3, 76.2, 56.1]}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Mouse_cord_ComputerDesk_0.geometry}
                // // material={nodes.Mouse_cord_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[-77, 75.1, 57.3]}
                rotation={[-Math.PI, 1.3, -Math.PI]}
                scale={[0.1, 0.1, 0.1]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.CD_ComputerDesk_0.geometry}
                // // material={nodes.CD_ComputerDesk_0.material}
                />
            </group>
            <group position={[65.1, 0, 55.3]}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Drawers_ComputerDesk_0.geometry}
                // // material={nodes.Drawers_ComputerDesk_0.material}
                />
            </group>
            <group position={[50.7, 74.8, 18.9]} rotation={[0, -0.2, 0]}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Phone_stand_ComputerDesk_0.geometry}
                // // material={nodes.Phone_stand_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[46.9, 79.2, 18.5]}
                rotation={[0.2, -0.2, 0]}
                scale={[0.3, 0.3, 0.3]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Phonehandle_ComputerDesk_0.geometry}
                // // material={nodes.Phonehandle_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[-77, 75.4, 57.3]}
                rotation={[-Math.PI, 1.3, -Math.PI]}
                scale={[0.1, 0.1, 0.1]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.CD_case_ComputerDesk_0.geometry}
                // // material={nodes.CD_case_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[76.5, 76, 45.6]}
                rotation={[0, 0.2, 0]}
                scale={[0, 0, 0]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Pen_ComputerDesk_0.geometry}
                // // material={nodes.Pen_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[74.9, 74.6, 39.7]}
                rotation={[0, 0.1, 0]}
                scale={[0.1, 0.1, 0.1]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Paper_ComputerDesk_0.geometry}
                // // material={nodes.Paper_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[-41.9, 74.8, 65.9]}
                rotation={[Math.PI / 2, 0, 0.2]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Floppy_disk_FloppyDisk_0.geometry}
                // // material={materials.FloppyDisk}
                />
            </group>
            <group position={[-3.8, 74.8, 55.9]} scale={0.3}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Keyboard_ComputerDesk_0.geometry}
                // // material={nodes.Keyboard_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[-33.2, 74.8, 31.9]}
                rotation={[0, 0.4, 0]}
                scale={[0.2, 0.2, 0.2]}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.SpeakerR_ComputerDesk_0.geometry}
                // // material={nodes.SpeakerR_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[27.4, 74.8, 27.4]}
                rotation={[0, -0.1, 0]}
                scale={0.2}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.SpeakerL_ComputerDesk_0.geometry}
                // // material={nodes.SpeakerL_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[43, 74.8, 54.3]}
                rotation={[0, -0.1, 0]}
                scale={0.1}
            >
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Mousepad_ComputerDesk_0.geometry}
                // // material={nodes.Mousepad_ComputerDesk_0.material}
                />
            </group>
            <group position={[34.3, 76.2, 56.1]} scale={0.3}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Mouse_ComputerDesk_0.geometry}
                // // material={nodes.Mouse_ComputerDesk_0.material}
                />
            </group> */}
            <group position={[-55.1, 74.8, 31.2]} scale={0.2}>
                <mesh
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Computer_case_ComputerDesk_0.geometry}
                material={nodes.Computer_case_ComputerDesk_0.material}
                />
            </group>
            <group 
                scale={0.3}
                position={[0, -8, 0]}>
                <mesh
                ref={mesh}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Office_desk_ComputerDesk_0.geometry}
                material={nodes.Office_desk_ComputerDesk_0.material}
                />
            </group>
            <group
                position={[10.9, 0, 115.7]}
                rotation={[0, 0.6, 0]}
                scale={[0.4, 0.4, 0.4]}
            >
                <mesh
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Cube000_ComputerDesk_0.geometry}
                material={nodes.Cube000_ComputerDesk_0.material}
                />
            </group>
            <group position={[-3.9, 74.8, 28]} scale={[0.2, 0.1, 0.1]}>
                <mesh
                color={0x202020}
                {...props.extras}
                castShadow
                receiveShadow
                geometry={nodes.Computer_monitor001_ComputerDesk_0.geometry}
                material={nodes.Computer_monitor001_ComputerDesk_0.material}
                />
            </group>
            </group>
        </group>
    );
}