import * as THREE from 'three'
import React, { useRef, useState, useMemo } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import earthImg from '../images/earth.jpg'
import moonImg from '../images/moon.png'

// City data with coordinates (latitude, longitude)
// Note: Saudi Arabia represented by Mecca (holiest city)
const cities = [
  { name: 'Mecca, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
  { name: 'Athens', lat: 37.9838, lng: 23.7275 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: "Xi'an", lat: 34.3416, lng: 108.9398 },
  { name: 'Uluru', lat: -25.3444, lng: 131.0369 },
  { name: 'Cusco', lat: -13.5319, lng: -71.9675 },
  { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
]

// Convert latitude/longitude to 3D position on sphere
// Sphere radius is 5 (matches sphereGeometry args)
function latLngToPosition(lat, lng, radius = 5) {
  const phi = (90 - lat) * (Math.PI / 180) // Convert to radians, adjust for THREE.js
  const theta = (lng + 180) * (Math.PI / 180) // Convert to radians, adjust for THREE.js

  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return [x, y, z]
}

// Curved Text Component - renders text along an arc above the Earth
// Fixed to camera view (doesn't rotate with Earth)
function CurvedText({ text, radius = 6.5, startAngle = -Math.PI / 3, endAngle = Math.PI / 3, height = 3 }) {
  const groupRef = useRef()

  // Make text always face the camera (fixed position relative to viewer)
  useFrame(({ camera }) => {
    if (groupRef.current) {
      // Get camera direction and position the text group to always face the camera
      const cameraDirection = new THREE.Vector3()
      camera.getWorldDirection(cameraDirection)

      // Calculate position above Earth, facing the camera
      const upOffset = new THREE.Vector3(0, height, 0)
      const forwardOffset = cameraDirection.clone().multiplyScalar(-radius)

      // Position the text group to face the camera
      groupRef.current.position.set(0, 0, 0)
      groupRef.current.lookAt(camera.position)
    }
  })

  const letters = useMemo(() => {
    const chars = text.split('')
    const totalAngle = endAngle - startAngle
    const angleStep = totalAngle / (chars.length - 1 || 1)

    return chars.map((char, i) => {
      const angle = startAngle + i * angleStep
      const x = radius * Math.sin(angle)
      const z = radius * Math.cos(angle)
      const y = height
      // Rotate each letter to face outward from the curve
      const rotationY = -angle

      return {
        char,
        position: [x, y, z],
        rotation: [0, rotationY, 0],
      }
    })
  }, [text, radius, startAngle, endAngle, height])

  return (
    <group ref={groupRef}>
      {letters.map((letter, i) => (
        <Text
          key={i}
          position={letter.position}
          rotation={letter.rotation}
          fontSize={0.6}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          font={undefined}
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {letter.char}
        </Text>
      ))}
    </group>
  )
}

// City Marker Component
function CityMarker({ city, onSelect, isSelected }) {
  const position = latLngToPosition(city.lat, city.lng, 5.1) // Slightly above surface

  return (
    <group position={position}>
      {/* Marker point */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(city.name)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#00ff00' : '#ff3333'} />
      </mesh>

      {/* City name label (only visible when marker is visible) */}
      <Html
        position={[0, 0.15, 0]}
        center
        occlude
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '30px',
            fontFamily: 'Arial, sans-serif',
            textShadow: '2px 2px 4px black, -2px -2px 4px black',
            whiteSpace: 'nowrap',
          }}
        >
          {city.name}
        </div>
      </Html>

      {/* Info box (shown when selected, only visible when marker is visible) */}
      {isSelected && (
        <Html
          position={[0, 0.4, 0]}
          center
          occlude
          style={{
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #4a90d9',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#4a90d9',
              }}
            >
              📍 {city.name}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#aaa',
              }}
            >
              Lat: {city.lat.toFixed(2)}° | Lng: {city.lng.toFixed(2)}°
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(null)
              }}
              style={{
                marginTop: '10px',
                padding: '4px 12px',
                fontSize: '11px',
                backgroundColor: '#4a90d9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Planets() {
  const ref = useRef()
  const [selectedCity, setSelectedCity] = useState(null)
  const [texture] = useLoader(THREE.TextureLoader, [earthImg])

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName === selectedCity ? null : cityName)
  }

  return (
    <group ref={ref} scale={[100, 100, 100]} position={[0, 0, 0]}>
      {/* Earth sphere */}
      <mesh
        onClick={() => setSelectedCity(null)} // Click on Earth to deselect
      >
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={1} fog={false} />
      </mesh>

      {/* Curved title text above Earth */}
      <CurvedText text="MYTHOS WORLD MAP" radius={3.5} height={5.2} startAngle={-Math.PI / 5} endAngle={Math.PI / 5} />

      {/* City markers */}
      {cities.map((city) => (
        <CityMarker
          key={city.name}
          city={city}
          onSelect={handleSelectCity}
          isSelected={selectedCity === city.name}
        />
      ))}

      {/*
      <mesh position={[5, -5, -5]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial roughness={1} map={moon} fog={false} />
      </mesh>
      */}
      {/* <pointLight position={[-5, -5, -5]} distance={1000} intensity={6} /> */}
      {/*
      <mesh position={[-30, -10, -60]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#FFFF99" fog={false} />
        <pointLight distance={6100} intensity={50} color="white" />
      </mesh>
      */}
    </group>
  )
}
