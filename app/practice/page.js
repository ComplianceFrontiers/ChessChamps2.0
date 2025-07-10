'use client';

import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import CustomChessboard from "../components/CustomChessboard";

export default function ChessApp() {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [boardPosition, setBoardPosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [inputFen, setInputFen] = useState("");
  const [correctMove, setCorrectMove] = useState("");
  const [message, setMessage] = useState("");
  const [isGameSetup, setIsGameSetup] = useState(false);
  const [targetGame, setTargetGame] = useState(null);
  const [boardKey, setBoardKey] = useState(0);

  // Force re-render when gamePosition changes
  useEffect(() => {
    console.log("useEffect triggered - gamePosition changed:", gamePosition);
    setBoardKey(prev => prev + 1);
    const newBoardPosition = gamePosition.split(' ')[0];
    console.log("Setting board position to:", newBoardPosition);
    setBoardPosition(newBoardPosition);
  }, [gamePosition]);

  const setupGame = () => {
    console.log("Setup game called with:", inputFen, correctMove);
    console.log("FEN length:", inputFen.length);
    console.log("FEN parts:", inputFen.split(' ').length);

    if (!inputFen.trim()) {
      setMessage("Please enter a FEN notation!");
      return;
    }

    if (!correctMove.trim()) {
      setMessage("Please enter the correct move!");
      return;
    }

    const fenParts = inputFen.trim().split(' ');
    if (fenParts.length !== 6) {
      setMessage(`Invalid FEN: Expected 6 parts but got ${fenParts.length}. FEN should be "position w/b castling en-passant halfmove fullmove"`);
      return;
    }
try{
    // Create and validate the initial position
let newGame;

try {
  // Method 1: Try constructor with FEN
  newGame = new Chess(inputFen.trim());
  console.log("Method 1 (constructor) worked");
} catch (e) {
  console.log("Method 1 failed, trying method 2");

  // Method 2: Use empty constructor and load()
  newGame = new Chess();
  const loadResult = newGame.load(inputFen.trim());
  console.log("Method 2 load result:", loadResult);

  if (!loadResult) {
    throw new Error("Both methods failed to load FEN");
  }
}

console.log("Game after loading FEN:", newGame.fen());
console.log("Game is valid:", newGame.isGameOver() !== undefined);

// Create target game to test the correct move
let targetGameInstance;
try {
  targetGameInstance = new Chess(inputFen.trim());
} catch (e) {
  targetGameInstance = new Chess();
  targetGameInstance.load(inputFen.trim());
}

console.log("Attempting move:", correctMove.trim());
const move = targetGameInstance.move(correctMove.trim());

console.log("Move result:", move);

if (!move) {
  setMessage(`Invalid correct move '${correctMove}'! Please check the move notation.`);
  return;
}

// If we reach here, everything is valid
setGame(newGame);
const newFen = newGame.fen();
console.log("About to set gamePosition to:", newFen);

// Force immediate update
setGamePosition(newFen);
setBoardPosition(newFen.split(' ')[0]);
setBoardKey(prev => prev + 1);

setTargetGame(targetGameInstance);
setIsGameSetup(true);
console.log("Game set up successful");
console.log("Initial Position:",newGame.fen());
console.log("Target Game Position after crt move:", targetGameInstance.fen());
console.log("Board position set to:", newFen.split(' ')[0]);
setMessage(`Game set up successfully! Current turn: ${newGame.turn()=='w'?'White':'Black'} to move.`);
}catch(error){
  console.error("Set up error:",error);
  setMessage(`Error setting up game: ${error.message}`);

}};
// Reset Game Function
const resetGame = () => {
  setGame(new Chess());
  setGamePosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  setBoardPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  setInputFen("");
  setCorrectMove("");
  setMessage("");
  setIsGameSetup(false);
  setTargetGame(null);
};

// Handle Piece Drop
const onDrop = useCallback((sourceSquare, targetSquare) => {
  try {
    const gameCopy = new Chess(game.fen());

    // First try the move without promotion
    let moveObj = {
      from: sourceSquare,
      to: targetSquare
    };

    let move;

    try {
      move = gameCopy.move(moveObj);
    } catch (moveError) {
      // If move failed, it might be a pawn promotion
      const piece = game.get(sourceSquare);
      const toRank = targetSquare[1];

      if (piece && piece.type === 'p' && (toRank === '8' || toRank === '1')) {
        // It's a pawn promotion, try with queen promotion
        try {
          moveObj.promotion = 'q';
          move = gameCopy.move(moveObj);
        } catch (promotionError) {
          // Even promotion failed, move is invalid
          move = null;
        }
      } else {
        move = null; // Invalid move
      }
    }
// Inside a React functional component

if (!move) {
  setMessage("Invalid move! Try again.");
  return false;
}

// Check if the move matches the correct move BEFORE updating the board
if (targetGame && gameCopy.fen() === targetGame.fen()) {
  // Correct move - update the board and show success message
  setGame(gameCopy);
  setGamePosition(gameCopy.fen());
  
  setMessage("Correct move! Well done!");
  return true;
} else {
  // Incorrect move - don't update the board, keep original position
  setMessage("❌ That's not the correct move. Try again!");
  // Force board to stay in original position by updating board key
  setBoardKey(prev => prev + 1);
  return false;
}

} catch (error) {
  console.error("Move error:", error);
  setMessage("Error making move. Try again.");
  return false;
}

}, [game, targetGame]);

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
       Practice
      </h1>

      {!isGameSetup ? (
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Set up your chess position
          </h2>

          <div className="space-y-6">
            {/* FEN Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                FEN Notation:
              </label>
              <input
                type="text"
                value={inputFen}
                onChange={(e) => setInputFen(e.target.value)}
                placeholder="e.g., rnbqkbpp/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                className="w-full p-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
            </div>

            {/* Correct Move Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Correct Move (in algebraic notation):
              </label>
              <input
                type="text"
                value={correctMove}
                onChange={(e) => setCorrectMove(e.target.value)}
                placeholder="e.g., e4, Nf3, 0-0, exd5"
                className="w-full p-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
            </div>

            {/* Player to Move */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Player to Move:
              </label>
              <select
                value={
                  inputFen.includes(' w ') ? 'w' :
                  inputFen.includes(' b ') ? 'b' : 'w'
                }
                onChange={(e) => {
                  if (inputFen) {
                    // Update the FEN to change the active player
                    const fenParts = inputFen.split(' ');
                    if (fenParts.length >= 2) {
                      fenParts[1] = e.target.value;
                      setInputFen(fenParts.join(' '));
                    }
                  }
                }}
                className="w-full p-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="w">White to Move</option>
                <option value="b">Black to Move</option>
              </select>
            </div>

            {/* Setup Button */}
            <button
              onClick={() => {
                console.log("Set up Game button clicked!");
                setMessage("Setting up game...");
                setupGame();
              }}
              disabled={!inputFen || !correctMove}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Up Game
            </button>
          
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs border border-gray-200">
  <p className="font-bold text-gray-800 text-sm">Debug Info:</p>
  <p className="text-gray-700">
    FEN Length: <span className="font-medium">{inputFen.length}</span>
  </p>
  <p className="text-gray-700">
    FEN Segments: <span className="font-medium">{inputFen.split(' ').length}</span> (should be 6)
  </p>
  <p className="text-gray-700">
    Move Length: <span className="font-medium">{correctMove.length}</span>
  </p>
  <p className="text-gray-700">
    Game Setup: <span className="font-medium">{isGameSetup ? 'Yes' : 'No'}</span>
  </p>
  <p className="text-gray-700">
    Button Disabled: <span className="font-medium">{(!inputFen || !correctMove) ? 'Yes' : 'No'}</span>
  </p>

{inputFen && (
  
<p className="mt-3">
  <span className="font-bold text-gray-800">Current FEN:</span><br />
  <span className="break-all text-gray-600 bg-white p-2 rounded border text-xs font-mono">{inputFen}</span>
  </p>
  )}
</div>

{/* Message display in setup phase */}
{message && (
  <div className={`mt-6 p-4 rounded-lg border-2 font-medium ${
    message.includes('successful') || message.includes('set up')
      ? 'bg-green-50 text-green-800 border-green-200'
      : message.includes('Invalid') || message.includes('Error')
      ? 'bg-red-50 text-red-800 border-red-200'
      : 'bg-blue-50 text-blue-800 border-blue-200'
  }`}>
    <p>{message}</p>
    </div>
    )}
  </div>
  </div>
):(
<div className="bg-white rounded-lg shadow-xl p-8 mb-8 border border-gray-200">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-semibold text-gray-900">Make your move!</h2>
    <button
      onClick={resetGame}
      className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
    >
      Reset Game
    </button>
  </div>
 
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <div className="flex flex-col">
    <div className="mb-6">
      <div className="flex justify-center">
        <div style={{ height: '400px', width: '400px' }}>
          <CustomChessboard
            position={game.fen().split(' ')[0]}
            currentPlayer={game.turn()}
            onMove={( sourceSquare, targetSquare ) => {
              console.log('Custom board move:', sourceSquare, 'to', targetSquare);
              return onDrop(sourceSquare, targetSquare);
            }}
            boardKey={boardKey}
          />
        </div>
      </div>
    </div>
    </div>

    {/* Game Info Section */}
    <div className=" flex flex-col space-y-6">
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Game Info:</h3>
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold">Turn:</span>
          <span className="font-medium text-gray-900">{game.turn() === 'w' ? 'White' : 'Black'}</span>
        </p>
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold">Board Key:</span>
          <span className="font-medium text-gray-900">{boardKey}</span>
        </p>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Current FEN:</span><br />
          <span className="font-mono text-xs bg-white p-2 rounded border break-all mt-1 block">{gamePosition}</span>
      </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
        <p className="text-blue-800 leading-relaxed">
          Click on a piece to see valid moves, then drag and drop or click to make your move. <br />
          The board automatically rotates when it’s Black’s turn, showing the position from Black’s perspective. <br />
          Only the correct move will be accepted – the board will reset if you make the wrong move!
        </p>
      </div>

      {/* Message display after setup */}
      {message && (
        <div className={`p-4 md:p-6 rounded-lg border-2 font-medium ${
          message.includes('correct') 
            ? 'bg-green-50 text-green-800 border-green-200'
            : message.includes('Invalid') || message.includes('not the correct')
            ? 'bg-red-50 text-red-800 border-red-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <p>{message}</p>
        </div>
      )}

      {/* Move History */}
      <div className="bg-white p-3 rounded border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Move History:</h3>
        <div className="text-sm text-grey-700 max-h-32 overflow-y-auto ">
        {game.history().length > 0 ? (
          <div className="space-y-1 font-mono text-xs bg-white p-3 rounded border">
            {game.history().map((move, index) => (
              <div key={index} className="flex">
                <span className="w-8 text-grey-500">{Math.ceil((index + 1) / 2)}.</span>
                <span className="text-grey-900 font-medium">{move}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No moves yet</p>
        )}
      </div>
    </div>
  </div>
</div>
</div>
)}
{/* App instructions section */}
<div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 mt-8">
  <h3 className="text-xl font-semibold text-gray-900 mb-4">How to use this app:</h3>
  <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
    <li>Enter a valid FEN notation for the chess position</li>
    <li>Enter the correct move in algebraic notation (e.g., e5, Nf3, O-O)</li>
    <li>Select which player should move (White or Black)</li>
    <li>Click “Set up Game” to load the position</li>
    <li>Click on pieces to see valid moves, then drag and drop or click to make moves</li>
    <li>The board automatically rotates when it s Black’s turn</li>
    <li>Only the correct move will be accepted – incorrect moves will reset the board</li>
    <li>Find the exact correct move to complete the puzzle!</li>
  </ol>


{/* Example FEN section */}
<div className="mt-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
  <h4 className="font-semibold text-gray-900 mb-4">Example FEN positions:</h4>
  <div className="text-sm text-gray-700 space-y-4">
  <div>
  <p className="text-sm text-gray-700 mb-2">Starting position:</p>
  <div className="font-mono text-xs bg-white p-3 rounded border break-all">
    rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  </div></div><div>
  <p className="font-semibold text-gray-900 mb-2 mt-4">After 1. e4:</p>
  <div className="font-mono text-xs bg-white p-3 rounded border break-all">
    rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
  </div>
  </div>
</div>
</div>
</div>
</div>
</div>
  );
}
