import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Model3DPreview } from "./3d-model-preview"

interface Wallpaper {
  id: string
  name: string
  description: string
  price: number
  preview: string
  category: "nature" | "abstract" | "minimal" | "3d"
  type?: "wallpaper" | "3d"
}

interface WallpaperPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  wallpaper: Wallpaper | null
  isOwned: boolean
  onApply?: () => void
}

export function WallpaperPreviewModal({
  isOpen,
  onClose,
  wallpaper,
  isOwned,
  onApply,
}: WallpaperPreviewModalProps) {
  if (!isOpen || !wallpaper) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl m-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-foreground">Preview: {wallpaper.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Full Preview */}
        <div className={cn(
          "flex-1 min-h-[400px] relative",
          wallpaper.type === "3d" ? "bg-transparent" : wallpaper.preview
        )}>
          {wallpaper.type === "3d" ? (
            <Model3DPreview className="w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
                <p className="text-white text-lg font-semibold mb-2">{wallpaper.name}</p>
                <p className="text-white/90 text-sm">{wallpaper.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isOwned 
                  ? wallpaper.type === "3d" 
                    ? "You own this 3D model" 
                    : "You own this wallpaper"
                  : wallpaper.type === "3d"
                    ? "Purchase to unlock this 3D model"
                    : "Purchase to unlock this wallpaper"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isOwned && onApply && wallpaper.type !== "3d" && (
                <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="h-4 w-4 mr-2" />
                  Apply Wallpaper
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

