/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import CustomChessboard from "../components/CustomChessboard";

export default function ChessApp() {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [boardPosition, setBoardPosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [inputFen, setInputFen] = useState("");
  const [fenSet, setFenSet] = useState([]);
  const [currentFenIndex, setCurrentFenIndex] = useState(0);
  const [autoCorrectMove, setAutoCorrectMove] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [isGameSetup, setIsGameSetup] = useState(false);
  const [targetGame, setTargetGame] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState(0);

  // Force re-render when gamePosition changes
  useEffect(() => {
    console.log("useEffect triggered - gamePosition changed:", gamePosition);
    setBoardKey(prev => prev + 1);
    const newBoardPosition = gamePosition.split(' ')[0];
    console.log("Setting board position to:", newBoardPosition);
    setBoardPosition(newBoardPosition);
  }, [gamePosition]);

  // Function to get best move using simple evaluation
  const analyzeFenPosition = async (fen) => {
    try {
      // Create a temporary game to analyze
      const tempGame = new Chess(fen);
      
      // Get all legal moves
      const moves = tempGame.moves({ verbose: true });
      
      if (moves.length === 0) {
        throw new Error('No legal moves available');
      }
      
      // Simple evaluation: prioritize captures, checks, and center control
      let bestMove = moves[0];
      let bestScore = -999;
      
      for (const move of moves) {
        let score = 0;
        
        // Prioritize captures
        if (move.captured) {
          const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
          score += pieceValues[move.captured] * 10;
        }
        
        // Prioritize checks
        tempGame.move(move);
        if (tempGame.inCheck()) {
          score += 20;
        }
        tempGame.undo();
        
        // Prioritize center control (e4, e5, d4, d5)
        const centerSquares = ['e4', 'e5', 'd4', 'd5'];
        if (centerSquares.includes(move.to)) {
          score += 5;
        }
        
        // Prioritize piece development (moving from back rank)
        if (move.from[1] === '1' || move.from[1] === '8') {
          score += 3;
        }
        
        // Small random factor to avoid always picking the same move
        score += Math.random() * 0.1;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      // Return the best move instead of setting state directly
      return bestMove.san;
      
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  // Function to load the next puzzle in the set
  const loadNextPuzzle = async () => {
    if (currentFenIndex < fenSet.length - 1) {
      const nextIndex = currentFenIndex + 1;
      setCurrentFenIndex(nextIndex);
      const nextFen = fenSet[nextIndex];
      
      // Auto-analyze the next position
      setIsAnalyzing(true);
      
      try {
        const bestMove = await analyzeFenPosition(nextFen);
        setAutoCorrectMove(bestMove);
        
        // Set up the next game
        const newGame = new Chess(nextFen);
        const targetGameInstance = new Chess(nextFen);
        const move = targetGameInstance.move(bestMove);
        
        if (move) {
          setGame(newGame);
          setGamePosition(newGame.fen());
          setBoardPosition(newGame.fen().split(' ')[0]);
          setBoardKey(prev => prev + 1);
          setTargetGame(targetGameInstance);
          
          setMessage(`Puzzle ${nextIndex + 1}/${fenSet.length} - Current turn: ${newGame.turn() === 'w' ? 'White' : 'Black'} to move. Best move: ${bestMove}`);
        }
        
      } catch (error) {
        console.error('Error loading next puzzle:', error);
        setMessage('Error loading next puzzle. Check the FEN format.');
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // All puzzles completed
      setMessage("🎉 Congratulations! You've completed all puzzles in this set!");
      setIsGameSetup(false);
    }
  };

  // Function to parse FEN set input
  const parseFenSet = (input) => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => line.split(' ').length === 6); // Valid FEN should have 6 parts
  };

  const setupGame = async () => {
    console.log("Setup game called with FEN input:", inputFen);
    
    if (!inputFen.trim()) {
      setMessage("Please enter FEN notation(s)!");
      return;
    }
    
    // Parse FEN input - could be single FEN or multiple FENs
    const fenList = parseFenSet(inputFen);
    
    if (fenList.length === 0) {
      setMessage("No valid FEN positions found! Please check your input.");
      return;
    }
    
    console.log(`Found ${fenList.length} FEN position(s)`);
    
    // Set up for multiple FENs
    setFenSet(fenList);
    setCurrentFenIndex(0);
    setCompletedPuzzles(0);
    
    const firstFen = fenList[0];
    
    // Auto-analyze the first position
    setIsAnalyzing(true);
    
    try {
      const bestMove = await analyzeFenPosition(firstFen);
      setAutoCorrectMove(bestMove);
      setMessage(`Best move found: ${bestMove} (auto-analysis complete)`);
      
      // Validate the first FEN
      let newGame;
      try {
        newGame = new Chess(firstFen);
      } catch (e) {
        newGame = new Chess();
        const loadResult = newGame.load(firstFen);
        if (!loadResult) {
          throw new Error("Failed to load FEN");
        }
      }
      
      // Create target game to test the correct move
      let targetGameInstance;
      try {
        targetGameInstance = new Chess(firstFen);
      } catch (e) {
        targetGameInstance = new Chess();
        targetGameInstance.load(firstFen);
      }
      
      console.log("Testing move:", bestMove);
      const move = targetGameInstance.move(bestMove);
      
      if (!move) {
        setMessage(`Invalid move '${bestMove}' for the first position! Please check.`);
        setIsAnalyzing(false);
        return;
      }
      
      // Set up the first game
      setGame(newGame);
      const newFen = newGame.fen();
      setGamePosition(newFen);
      setBoardPosition(newFen.split(' ')[0]);
      setBoardKey(prev => prev + 1);
      setTargetGame(targetGameInstance);
      setIsGameSetup(true);
      
      if (fenList.length === 1) {
        setMessage(`Game set up successfully! Current turn: ${newGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
      } else {
        setMessage(`Puzzle set loaded! Starting puzzle 1/${fenList.length} - ${newGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
      }
      
    } catch (error) {
      console.error("Analysis or setup error:", error);
      setMessage("Could not auto-analyze the position. Please check the FEN format.");
      setIsAnalyzing(false);
      return;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setGamePosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setBoardPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    setInputFen("");
    setFenSet([]);
    setCurrentFenIndex(0);
    setAutoCorrectMove("");
    setCompletedPuzzles(0);
    setMessage("");
    setIsGameSetup(false);
    setTargetGame(null);
  };

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
          // Not a promotion move, just invalid
          move = null;
        }
      }

      // If move is still invalid
      if (!move) {
        setMessage("Invalid move! Try again.");
        return false;
      }

      // Check if the move matches the correct move BEFORE updating the board
      if (targetGame && gameCopy.fen() === targetGame.fen()) {
        // Correct move - update the board and show success message
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setCompletedPuzzles(prev => prev + 1);
        
        if (fenSet.length > 1) {
          setMessage("🎉 Correct! Loading next puzzle...");
          // Auto-proceed to next puzzle after a short delay
          setTimeout(() => {
            loadNextPuzzle();
          }, 1500);
        } else {
          setMessage("🎉 Correct move! Well done!");
        }
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
          Chess Champs 2.0
        </h1>
        
        {!isGameSetup ? (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Set up your chess position
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  FEN Notation(s):
                </label>
                <textarea
                  value={inputFen}
                  onChange={(e) => setInputFen(e.target.value)}
                  placeholder="Enter one or more FEN positions (one per line):
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 3"
                  rows={6}
                  className="w-full p-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-2">
                  💡 You can paste multiple FEN positions (one per line) to create a puzzle set
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Player to Move:
                </label>
                <select
                  value={inputFen.includes(' w ') ? 'w' : inputFen.includes(' b ') ? 'b' : 'w'}
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
                  className="w-full p-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="w">White to Move</option>
                  <option value="b">Black to Move</option>
                </select>
              </div>
              
              <button
                onClick={() => {
                  console.log("Set up Game button clicked!");
                  setMessage("Setting up puzzle set...");
                  setupGame();
                }}
                disabled={!inputFen || isAnalyzing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-md"
              >
                {isAnalyzing ? "Analyzing..." : "🚀 Start Puzzle Set"}
              </button>
              
              {/* Debug info */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs border border-gray-200">
                <p className="font-bold text-gray-800 mb-2">Debug Info:</p>
                <p className="text-gray-700">FEN Input Length: <span className="font-medium">{inputFen.length}</span></p>
                <p className="text-gray-700">Detected FENs: <span className="font-medium">{parseFenSet(inputFen).length}</span></p>
                <p className="text-gray-700">Is Game Setup: <span className="font-medium">{isGameSetup ? 'Yes' : 'No'}</span></p>
                <p className="text-gray-700">Button Disabled: <span className="font-medium">{(!inputFen || isAnalyzing) ? 'Yes' : 'No'}</span></p>
                {inputFen && parseFenSet(inputFen).length > 0 && (
                  <p className="mt-3">
                    <span className="font-bold text-gray-800">First FEN:</span><br />
                    <span className="break-all text-gray-600 bg-white p-2 rounded border text-xs font-mono">{parseFenSet(inputFen)[0]}</span>
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
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Make your move!
              </h2>
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
                    <div style={{ width: '400px', height: '400px' }}>
                      <CustomChessboard
                        position={game.fen().split(' ')[0]}
                        currentPlayer={game.turn()}
                        onMove={(sourceSquare, targetSquare) => {
                          console.log('Custom board move:', sourceSquare, 'to', targetSquare);
                          return onDrop(sourceSquare, targetSquare);
                        }}
                        boardKey={boardKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-6">
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Game Info:</h3>
                  {fenSet.length > 1 && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Progress:</span> 
                      <span className="font-medium text-blue-900">
                        Puzzle {currentFenIndex + 1}/{fenSet.length} 
                        ({completedPuzzles} completed)
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Turn:</span> 
                    <span className="font-medium text-gray-900">{game.turn() === 'w' ? 'White' : 'Black'}</span>
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-semibold">Board Key:</span> 
                    <span className="font-medium text-gray-900">{boardKey}</span>
                  </p>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Current FEN:</span><br />
                    <span className="font-mono text-xs bg-white p-2 rounded border break-all block mt-1">{gamePosition}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Click on a piece to see valid moves, then drag and drop or click to make your move. 
                    The board automatically rotates when it's Black's turn, showing the position from Black's perspective.
                    Only the correct move will be accepted - the board will reset if you make the wrong move!
                  </p>
                </div>
                
                {message && (
                  <div className={`p-4 md:p-6 rounded-lg border-2 font-medium ${
                    message.includes('Correct') 
                      ? 'bg-green-50 text-green-800 border-green-200' 
                      : message.includes('Invalid') || message.includes('not the correct')
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    <p>{message}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Move History:</h3>
                  <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                    {game.history().length > 0 ? (
                      <div className="space-y-1 font-mono text-xs bg-white p-3 rounded border">
                        {game.history().map((move, index) => (
                          <div key={index} className="flex">
                            <span className="w-8 text-gray-500">{Math.ceil((index + 1) / 2)}.</span>
                            <span className="text-gray-900 font-medium">{move}</span>
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
      </div>
    </div>
  );
}

