import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense } from "react"
import { Loader2, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Preload the Porsche 911 model for better performance
// useGLTF.preload("/assets/porsche_911.glb") // DISABLED FOR TESTING

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </Html>
  )
}

function PorscheModel() {
  const { scene } = useGLTF("/assets/porsche_911.glb")
  return <primitive object={scene} scale={1} />
}

interface Sale3DModalProps {
  isOpen: boolean
  onClose: () => void
}

export function Sale3DModal({ isOpen, onClose }: Sale3DModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] m-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-500 to-orange-500">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold text-white">Special Sale - 3D Preview</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">3D Preview Disabled for Testing</div>
          {/* ORIGINAL THREE.JS CODE - DISABLED FOR TESTING
          <Canvas camera={{ position: [0.028, 0.02, 0.04], fov: 50, near: 0.01 }}>
            <Suspense fallback={<LoadingSpinner />}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <PorscheModel />
              <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} minDistance={0.001} />
              <Environment preset="sunset" />
            </Suspense>
          </Canvas>
          */}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rotate and pan to explore</p>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

