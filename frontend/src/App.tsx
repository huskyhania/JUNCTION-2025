import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import beeAvatar from "@/assets/bee.png"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-10">
      <div className="flex items-center gap-3 mb-6">
        <img src={beeAvatar} alt="Bee Saver Logo" className="w-12 h-12" />
        <h1 className="text-4xl text-blue-600 font-bold font-clash-display">
          Bee Saver
        </h1>
      </div>

      <p className="text-gray-500 mb-6 text-center">
        Learn financial skills, for real.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button asChild className="w-full" variant="outline">
          <Link to="/home">Start Learning</Link>
        </Button>
        <Button asChild className="w-full" variant="outline">
          <Link to="/chat">Chat bot</Link>
        </Button>
      </div>
    </div>
  );
}