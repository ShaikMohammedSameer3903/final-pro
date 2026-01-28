import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(Boolean(mq.matches))
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function Scene() {
  const blobs = useMemo(() => {
    return [
      { position: [-1.6, 0.6, -2.5], scale: 1.1, color: '#7c5cff' },
      { position: [1.8, -0.3, -2.2], scale: 1.0, color: '#00d4ff' },
      { position: [0.2, 1.3, -3.2], scale: 0.8, color: '#22c55e' },
    ]
  }, [])

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />

      {blobs.map((b, idx) => (
        <Float key={idx} speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          <mesh position={b.position} scale={b.scale}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial color={b.color} roughness={0.55} metalness={0.15} transparent opacity={0.15} />
          </mesh>
        </Float>
      ))}

      <Sparkles count={70} size={2} speed={0.35} opacity={0.25} scale={[10, 6, 6]} />
    </>
  )
}

export default function ThreeBackground() {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) return null

  return (
    <div className="three-bg" aria-hidden="true">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.6], fov: 55 }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
