import { Canvas } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { Html } from "@react-three/drei"
import { cn } from "@/lib/utils"

// Preload the Shiba model
// useGLTF.preload("/assets/shiba.glb") // DISABLED FOR TESTING

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    </Html>
  )
}

function ShibaModel() {
  const { scene } = useGLTF("/assets/shiba.glb")
  return <primitive object={scene} scale={2} />
}

interface Model3DPreviewProps {
  className?: string
}

export function Model3DPreview({ className }: Model3DPreviewProps) {
  // DISABLED FOR TESTING - Three.js disabled
  return (
    <div className={cn("bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center", className)}>
      <div className="text-white/50 text-sm">3D Preview Disabled</div>
    </div>
  )
  /* ORIGINAL THREE.JS CODE - DISABLED FOR TESTING
  return (
    <div className={cn("bg-transparent", className)}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50, near: 0.01 }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={<LoadingSpinner />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ShibaModel />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={1} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
  */
}

