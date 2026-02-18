// RR PR Test
import * as THREE from 'three'
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
//import Stars from './3d/Stars'
import Planets from './3d/Planets'
import Effects from './3d/Effects'
//import Particles from './3d/Particles'
//import Enemies from './3d/Enemies'
//import Rocks from './3d/Rocks'
//import Explosions from './3d/Explosions'
//import Rings from './3d/Rings'
//import Track from './3d/Track'
//import Ship from './3d/Ship'
//import Rig from './3d/Rig'
import Hud from './Hud'
import useStore from './store'

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
//import { Stars } from '@react-three/drei'
import StarsStatic from './3d/StarsStatic'

// RR Use ACESFilmicToneMapping for a high-quality "cinematic" look

export default function WorldMap() {
  const { fov } = useStore((state) => state.mutation)
  const actions = useStore((state) => state.actions)

  //  {/* camera={{ position: [3000, 3000, 2000], near: 0.01, far: 100000, fov }} */}
  // {/* onPointerMove={actions.updateMouse} onClick={actions.shoot} */}

  return (
    <div >
      <Canvas
        linear
        mode="concurrent" 
        dpr={[1, 1.5]}
        gl={{ antialias: false, 
              legacyLights: true }}
        camera={{ position: [0, 0, 1100], near: 0.1, far: 100000 }}
        onCreated={({ gl, camera }) => {
          actions.init(camera)
          {/* gl.toneMapping = THREE.Uncharted2ToneMapping */}
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.setClearColor(new THREE.Color('#020209'))
        }}>
        <OrbitControls 
          target={[0, 0, 0]} 
          minDistance={1100}  // Stay just outside the 500-unit Earth surface
          maxDistance={1100}/>
        {/* 
          enablePan={false} 
          minDistance={600}  // Stay just outside the 500-unit Earth surface
          maxDistance={5000}


          enablePan={false}  // Prevents moving away from Earth
          enableZoom={false} // Disable zoom functionality
          minDistance={10}   // How close you can zoom
          maxDistance={1000} // How far you can zoom
        <PerspectiveCamera makeDefault position={[0, 0, 50]}> */}
        {/* <Stars count={5000} radius={500} /> */}
        {/* </PerspectiveCamera> */}
        {/* <fog attach="fog" args={['#070710', 100, 700]} /> */}
        {/* <fog attach="fog" args={['#070710', 1000, 20000]} /> */}
        <ambientLight intensity={5} />
        {/* <Stars /> */}
        <StarsStatic />
        {/*
        <Stars 
          radius={8000} 
          depth={700} 
          count={20000} 
          factor={7} 
          saturation={0} 
          fade 
          speed={0} 
        />
        */}
        {/* <Explosions /> */}
        {/* <Track /> */}
        {/* <Particles /> */}
        {/* <Rings /> */}
        <Suspense fallback={null}>
          <group name="SolarSystem">
            <Planets />
          </group>
          {/* <Rocks /> */}
          {/*<Planets /> */}
          {/* <Enemies /> */}
          {/*
          <Rig>
             <Ship /> 
          </Rig>
          */}
        </Suspense>
        {/* <Effects /> */}
      </Canvas>
      <Hud />
    </div>
  )
}
