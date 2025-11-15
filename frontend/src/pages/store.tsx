import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { Coins, Image, Check, Sparkles, Tag, Eye, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sale3DModal } from "@/components/sale-3d-modal"
import { WallpaperPreviewModal } from "@/components/wallpaper-preview-modal"
import { Model3DPreview } from "@/components/3d-model-preview"

interface Wallpaper {
  id: string
  name: string
  description: string
  price: number
  preview: string // Color or gradient for preview
  category: "nature" | "abstract" | "minimal" | "3d"
  type?: "wallpaper" | "3d"
}

const wallpapers: Wallpaper[] = [
  {
    id: "wallpaper-nature-1",
    name: "Forest Serenity",
    description: "Peaceful green forest landscape",
    price: 50,
    preview: "bg-gradient-to-br from-green-400 to-emerald-600",
    category: "nature",
  },
  {
    id: "wallpaper-nature-2",
    name: "Ocean Breeze",
    description: "Calming blue ocean waves",
    price: 50,
    preview: "bg-gradient-to-br from-blue-400 to-cyan-600",
    category: "nature",
  },
  {
    id: "wallpaper-abstract-1",
    name: "Cosmic Purple",
    description: "Vibrant purple galaxy theme",
    price: 75,
    preview: "bg-gradient-to-br from-purple-500 to-pink-600",
    category: "abstract",
  },
  {
    id: "wallpaper-abstract-2",
    name: "Sunset Glow",
    description: "Warm orange and red gradient",
    price: 75,
    preview: "bg-gradient-to-br from-orange-400 to-red-600",
    category: "abstract",
  },
  {
    id: "wallpaper-minimal-1",
    name: "Clean White",
    description: "Minimalist white background",
    price: 30,
    preview: "bg-gradient-to-br from-gray-100 to-gray-200",
    category: "minimal",
  },
  {
    id: "wallpaper-minimal-2",
    name: "Soft Gray",
    description: "Elegant gray gradient",
    price: 30,
    preview: "bg-gradient-to-br from-gray-300 to-gray-500",
    category: "minimal",
  },
  {
    id: "3d-model-shiba",
    name: "Shiba",
    description: "Your next best friend",
    price: 999,
    preview: "bg-gradient-to-br from-amber-400 to-orange-500",
    category: "3d",
    type: "3d",
  },
]

export default function Store() {
  const { user, addCoins, setCurrentWallpaper } = useUser()
  const [purchasedWallpapers, setPurchasedWallpapers] = useState<string[]>([])
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null)

  const handlePurchase = (wallpaper: Wallpaper) => {
    if (!user) return

    if (user.coin < wallpaper.price) {
      alert("Not enough coins!")
      return
    }

    // Deduct coins
    addCoins(-wallpaper.price)

    // Mark as purchased
    setPurchasedWallpapers([...purchasedWallpapers, wallpaper.id])

    alert(`Purchased ${wallpaper.name}! You can now use it as your wallpaper.`)
  }

  const isOwned = (wallpaperId: string) => {
    return purchasedWallpapers.includes(wallpaperId)
  }

  const handleApplyWallpaper = (wallpaper: Wallpaper) => {
    if (wallpaper.type === "3d") {
      // For 3D models, just show a message
      setPreviewWallpaper(null)
      alert(`You own the ${wallpaper.name}! View it in the preview.`)
      return
    }
    setCurrentWallpaper(wallpaper.preview)
    setPreviewWallpaper(null)
    alert(`Applied ${wallpaper.name} as your background!`)
  }

  return (
    <div className="p-6 space-y-6">
      <Sale3DModal isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} />
      <WallpaperPreviewModal
        isOpen={previewWallpaper !== null}
        onClose={() => setPreviewWallpaper(null)}
        wallpaper={previewWallpaper}
        isOwned={previewWallpaper ? isOwned(previewWallpaper.id) : false}
        onApply={previewWallpaper ? () => handleApplyWallpaper(previewWallpaper) : undefined}
      />
      
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Store</h1>
        {/* <p className="text-muted-foreground">Purchase wallpapers to customize your dashboard</p> */}
      </div>

      <div className="flex items-center gap-2 p-4 ">
        <Coins className="h-5 w-5 text-yellow-600" />
        <span className="text-lg font-semibold text-yellow-700">
          {user?.coin?.toLocaleString() || 0}
        </span>
      </div>

      {/* Featured Sale - 3D Modal */}
      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5" />
              <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">SPECIAL SALE</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Gredient Wallpapers</h2>
            <p className="text-white/90 mb-4">Explore our premium Wallpapers in an interactive viewer</p>
          </div>
          <div className="w-full md:w-64 h-48 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-white/50" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Wallpapers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wallpapers.map((wallpaper) => {
            const owned = isOwned(wallpaper.id)
            const canAfford = (user?.coin || 0) >= wallpaper.price

            return (
              <div
                key={wallpaper.id}
                className={cn(
                  "bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col",
                  owned && "ring-2 ring-green-500"
                )}
              >
                {/* Preview */}
                <div className={cn(
                  "w-full h-32 relative overflow-hidden",
                  wallpaper.type === "3d" ? "bg-transparent" : wallpaper.preview
                )}>
                  {owned && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full">
                      <Check className="h-3 w-3 text-white" />
                      <span className="text-xs font-semibold text-white">Owned</span>
                    </div>
                  )}
                  {wallpaper.type === "3d" ? (
                    <Model3DPreview className="w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="h-8 w-8 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-foreground">{wallpaper.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{wallpaper.description}</p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="text-lg font-bold text-yellow-700">
                          {wallpaper.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(wallpaper)}
                        disabled={owned || !canAfford}
                        size="sm"
                        className={cn(
                          owned && "opacity-50 cursor-not-allowed",
                          !canAfford && "opacity-50"
                        )}
                      >
                        {owned ? "Owned" : canAfford ? "Buy" : "Not enough"}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewWallpaper(wallpaper)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      {owned && wallpaper.type !== "3d" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApplyWallpaper(wallpaper)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

