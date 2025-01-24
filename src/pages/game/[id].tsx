import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';

let socket;

export default function Game() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [game, setGame] = useState(new Chess());
  const [orientation, setOrientation] = useState('white');

  useEffect(() => {
    if (!gameId) return;

    const initSocket = async () => {
      await fetch('/api/socket');
      socket = io();

      socket.emit('joinGame', gameId);

      socket.on('move', (move) => {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(move);
        setGame(gameCopy);
      });
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [gameId]);

  function makeMove(move) {
    const gameCopy = new Chess(game.fen());
    
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      
      if (result && socket) {
        socket.emit('move', {
          gameId,
          move: result
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    return move;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Game Code: {gameId}</h1>
            <p className="text-gray-600">Share this code with your opponent</p>
          </div>
          <div className="mb-4">
            <button
              onClick={() => setOrientation(orientation === 'white' ? 'black' : 'white')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Flip Board
            </button>
          </div>
          <div className="w-full aspect-square">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
            />
          </div>
          {game.isGameOver() && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <p className="text-lg font-bold">
                Game Over! 
                {game.isCheckmate() 
                  ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!` 
                  : game.isDraw() 
                    ? "It's a draw!" 
                    : 'Game ended.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
