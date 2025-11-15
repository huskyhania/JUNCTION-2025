import { useRef, useState } from "react";

export function CreditCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div className="relative rounded-xl overflow-hidden max-w-sm">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 text-white shadow-xl overflow-hidden"
      >
        {/* Spotlight effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(0, 229, 255, 0.2), transparent 80%)`
          }}
        />
        
        {/* Card Chip */}
        <div className="absolute top-6 left-6 w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
          <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
        </div>
        
        {/* Card Brand Logo */}
        <div className="absolute top-6 right-6">
          <div className="text-2xl font-bold">VISA</div>
        </div>
        
        {/* Card Number */}
        <div className="absolute top-24 left-6 right-6">
          <div className="text-2xl font-mono tracking-wider">
            <span className="mr-4">4532</span>
            <span className="mr-4">****</span>
            <span className="mr-4">****</span>
            <span>8901</span>
          </div>
        </div>
        
        {/* Cardholder Name */}
        <div className="absolute bottom-12 left-6">
          <div className="text-xs text-blue-200 uppercase tracking-wider mb-1">Cardholder Name</div>
          <div className="text-lg font-semibold">JOHN DOE</div>
        </div>
        
        {/* Expiry Date */}
        <div className="absolute bottom-12 right-6">
          <div className="text-xs text-blue-200 uppercase tracking-wider mb-1">Expires</div>
          <div className="text-lg font-semibold">12/26</div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      </div>
    </div>
  );
}

