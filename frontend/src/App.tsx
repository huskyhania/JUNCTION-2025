import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-10">
      <h1 className="text-4xl text-blue-600 font-bold mb-6">
        Bee Save
      </h1>

      <p className="text-gray-500 mb-6 text-center">
        Learn financial skills, for real.
      </p>

      <Link
        to="/home"
        className="
          w-full 
          max-w-xs
          bg-blue-600 
          hover:bg-blue-700 
          text-white 
          font-semibold 
          py-3 
          rounded-xl 
          shadow-sm 
          transition 
          active:scale-95 
          text-center 
          block
        "
      >
        Start Learning
      </Link>
        <Link
        to="/chat"
        className="
          w-full 
          max-w-xs
          bg-blue-600 
          hover:bg-blue-700 
          text-white 
          font-semibold 
          py-3 
          rounded-xl 
          shadow-sm 
          transition 
          active:scale-95 
          text-center 
          block
        "
      >
        Chat bot
      </Link>
    </div>
  );
}