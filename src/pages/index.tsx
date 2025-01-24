import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Link from 'next/link';

export default function Home() {
  const [gameId, setGameId] = useState('');

  useEffect(() => {
    setGameId(nanoid(8));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Online Chess</h1>
        <div className="space-y-4">
          <Link 
            href={`/game/${gameId}`}
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Game
          </Link>
          <div className="text-center">or</div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter game code"
              className="flex-1 p-2 border rounded-lg"
              onChange={(e) => setGameId(e.target.value)}
            />
            <Link
              href={`/game/${gameId}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Join Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}