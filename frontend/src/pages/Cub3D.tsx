import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Cub3D() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the game files exist
    const checkGameFiles = async () => {
      try {
        const response = await fetch("/cub3D.html");
        if (!response.ok) {
          setError("Game files not found. Please build the web version first.");
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to load game. Make sure the game files are in the public directory.");
        setIsLoading(false);
      }
    };

    checkGameFiles();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Game</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            To build the game, run: <code className="bg-gray-100 px-2 py-1 rounded">make -f Makefile.web</code> in the bonus directory,
            then copy the generated files to the public directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-white">Loading game...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/cub3D.html"
        className="w-full h-full border-0"
        title="Cub3D Game"
        onLoad={() => setIsLoading(false)}
        allow="fullscreen"
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
}

