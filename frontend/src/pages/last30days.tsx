import { Canvas } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"

// Preload the Porsche 911 model for better performance
useGLTF.preload("/assets/porsche_911.glb")

function PorscheModel() {
  const { scene } = useGLTF("/assets/porsche_911.glb")
  return <primitive object={scene} scale={1} />
}

export default function Last30DaysChart() {
  return (
    <div className=" rounded-xl h-80">
      {/* <h2 className="text-lg font-semibold mb-3">Last 30 Days Cashflow</h2> */}
      
      <div className="w-full h-[400px] rounded-lg overflow-hidden ">
        <Canvas camera={{ position: [0.028, 0.02, 0.04], fov: 50, near: 0.01 }}>
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          }>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <PorscheModel />
            <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} minDistance={0.001} />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}