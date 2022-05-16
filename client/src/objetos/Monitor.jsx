import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";


import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


export default function Monitor(props) {
    const { nodes, materials } = useLoader(GLTFLoader, '/monitor/scene.gltf')

    return (
      <group {...props} dispose={null}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={Math.random() * 0.02}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={Math.random() * 0.02}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor002_low_monitor_0.geometry}
                material={nodes.monitor002_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor_low_monitor_0.geometry}
                material={nodes.monitor_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor003_low_monitor_0.geometry}
                material={nodes.monitor003_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor004_low_monitor_0.geometry}
                material={nodes.monitor004_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor005_low_monitor_0.geometry}
                material={nodes.monitor005_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor006_low_monitor_0.geometry}
                material={nodes.monitor006_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor007_low_monitor_0.geometry}
                material={nodes.monitor007_low_monitor_0.material}
              />
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.monitor001_low_monitor_0.geometry}
                material={nodes.monitor001_low_monitor_0.material}
              />
            </group>
          </group>
        </group>
      </group>
    );
  }
  
  // useGLTF.preload("/low_poly_computer_desk/scene.gltf");
  
  