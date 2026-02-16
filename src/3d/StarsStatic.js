import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

export default function StaticStars() {
const groupRef = useRef()

useFrame(({ camera }) => {
  if (groupRef.current) {
  // 1. Move the stars to follow the camera position
  groupRef.current.position.copy(camera.position)

  // 2. Lock the rotation to world space (prevent stars from rotating with camera)
    groupRef.current.quaternion.set(0, 0, 0, 1)

  }
})

return (
<group ref={groupRef}>
<Stars
radius={8000}
depth={500}
count={7000}
factor={8}
saturation={0}
fade={false}
speed={0}
/>
</group>
)
}