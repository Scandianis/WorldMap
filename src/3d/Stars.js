/*
import React, { useMemo } from 'react'

export default function Stars({ count = 2000 }) {
  const positions = useMemo(() => {
    let positions = []
    for (let i = 0; i < count; i++) {
      const r = 4000
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000)
      const y = r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000)
      const z = r * Math.cos(phi) + (-1000 + Math.random() * 2000)
      positions.push(x)
      positions.push(y)
      positions.push(z)
    }
    return new Float32Array(positions)
  }, [count])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={15} sizeAttenuation color="white" fog={false} />
    </points>
  )
}
*/

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Stars({ count = 2000 }) {
  const groupRef = useRef()

  // 1. Keep the position logic largely the same, but let's 
  // center the random offsets to keep the sphere clean.
  const positions = useMemo(() => {
    let positions = []
    for (let i = 0; i < count; i++) {
      const r = 8000 // A bit larger to ensure we don't clip through stars
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = r * Math.cos(theta) * Math.sin(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(phi)
      
      positions.push(x, y, z)
    }
    return new Float32Array(positions)
  }, [count])

  // 2. This hook runs 60 times a second. 
  // It anchors the star group to the camera's location.
  useFrame(({ camera }) => {
    if (groupRef.current) {
      // 1. Follow the camera so we never leave the sphere
      groupRef.current.position.copy(camera.position);
      
      // 2. FORCE the stars to never rotate. 
      // This keeps them "locked" to the world's North/South/East/West
      groupRef.current.quaternion.set(0, 0, 0, 1); 
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={positions.length / 3} 
            array={positions} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={12} 
          sizeAttenuation 
          color="white" 
          fog={false} 
          transparent 
          opacity={0.8} 
        />
      </points>
    </group>
  )
}
