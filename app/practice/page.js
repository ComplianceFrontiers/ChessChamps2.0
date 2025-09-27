
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
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [userSide, setUserSide] = useState('w'); // Track which side user is playing
  const [hintUsed, setHintUsed] = useState(false);
  const [userMoveCount, setUserMoveCount] = useState(0); // Track user moves in current puzzle
  const [showVisualHint, setShowVisualHint] = useState(false); // Visual hint on board
  const [pendingMove, setPendingMove] = useState(null); // Store pending non-best move
  const [showMoveConfirmation, setShowMoveConfirmation] = useState(false); // Show confirmation dialog
  const [puzzleTitle, setPuzzleTitle] = useState(""); // Store puzzle title
  const [puzzleLevel, setPuzzleLevel] = useState(""); // Store puzzle level
  const [originalFenSet, setOriginalFenSet] = useState([]); // Store original FEN set for reset

  // Force re-render when gamePosition changes
  useEffect(() => {
    console.log("useEffect triggered - gamePosition changed:", gamePosition);
    setBoardKey(prev => prev + 1);
    const newBoardPosition = gamePosition.split(' ')[0];
    console.log("Setting board position to:", newBoardPosition);
    setBoardPosition(newBoardPosition);
  }, [gamePosition]);

  // Auto-load FENs from URL parameter on component mount
  useEffect(() => {
    const loadFensFromUrl = async () => {
      // Check if we're in the browser (not server-side rendering)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get ALL fens parameters (multiple fens= in URL)
        const allFensParams = urlParams.getAll('fens');
        console.log('🔗 All fens parameters:', allFensParams);
        
        // Fallback to single FEN parameter for backwards compatibility
        let urlFens = null;
        if (allFensParams.length > 0) {
          urlFens = allFensParams;
        } else {
          const singleFen = urlParams.get('fen');
          if (singleFen) {
            urlFens = [singleFen];
          }
        }

        const urlTitle = urlParams.get('title');
        if (urlTitle) {
          const decodedTitle = decodeURIComponent(urlTitle);
          setPuzzleTitle(decodedTitle);
        }

        const urlLevel = urlParams.get('level');
        if (urlLevel) {
          const decodedLevel = decodeURIComponent(urlLevel);
          setPuzzleLevel(decodedLevel);
        }
        
        if (urlFens && !isGameSetup) {
          console.log('🔗 Found FENs in URL:', urlFens);
          
          // Process all FEN parameters
          let allDecodedFens = [];
          
          urlFens.forEach((fenParam, index) => {
            console.log(`🔗 Processing fens parameter ${index + 1}:`, fenParam);
            
            // Decode URL-encoded FEN string
            const decoded = decodeURIComponent(fenParam);
            console.log('🔗 Decoded:', decoded);
            
            // Check if this parameter contains comma-separated FENs
            if (decoded.includes(',')) {
              console.log('🔗 Found comma-separated FENs');
              const commaSeparatedFens = decoded.split(',').map(fen => fen.trim());
              console.log('🔗 Split FENs:', commaSeparatedFens);
              allDecodedFens.push(...commaSeparatedFens);
            } else {
              // Single FEN in this parameter
              allDecodedFens.push(decoded);
            }
          });
          
          console.log('🔗 All decoded FENs:', allDecodedFens);
          
          // Join multiple FENs with newlines for proper parsing
          const finalFensString = allDecodedFens.join('\n');
          console.log('🔗 Final FENs string:', finalFensString);
          
          // Set the input and auto-start the puzzle
          setInputFen(finalFensString);
          setMessage(`🔗 Loading ${allDecodedFens.length > 1 ? `puzzle set (${allDecodedFens.length} puzzles)` : 'puzzle'} from URL...`);
          
          // Wait a moment for state to update, then start the game
          setTimeout(() => {
            setupGameWithFen(finalFensString);
          }, 500);
        }
      }
    };

    loadFensFromUrl();
  }, []); // Only run once on mount

  // Simple FEN validation without chess.js
  const simpleValidateFen = (fen) => {
    if (!fen || typeof fen !== 'string') {
      return { valid: false, error: 'FEN must be a non-empty string' };
    }
    
    fen = fen.trim();
    const parts = fen.split(' ');
    
    if (parts.length !== 6) {
      return { valid: false, error: `FEN must have 6 parts, found ${parts.length}` };
    }
    
    const [position] = parts;
    
    // Check for kings
    if (!position.includes('K')) {
      return { valid: false, error: 'Missing white king (K)' };
    }
    if (!position.includes('k')) {
      return { valid: false, error: 'Missing black king (k)' };
    }
    
    return { valid: true };
  };

  // Use simple validation first, then chess.js validation
  const validateFen = (fen) => {
    console.log("Starting FEN validation for:", fen);
    
    // First try simple validation
    const simpleCheck = simpleValidateFen(fen);
    console.log("Simple validation result:", simpleCheck);
    if (!simpleCheck.valid) {
      return simpleCheck;
    }
    
    // For now, let's trust simple validation and skip chess.js validation
    // to isolate the issue
    console.log("Simple validation passed, accepting FEN");
    return { valid: true };
    
    // Commented out chess.js validation temporarily
    /*
    // Then try chess.js validation
    try {
      console.log("Attempting chess.js validation...");
      const testGame = new Chess();
      
      // Try to load the FEN
      const loadResult = testGame.load(fen);
      console.log("Chess.js load result:", loadResult);
      
      // In newer versions of chess.js, load() returns true on success
      if (loadResult === false) {
        console.log("Chess.js load returned false");
        return { valid: false, error: 'Invalid FEN format (chess.js load failed)' };
      }
      
      console.log("Chess.js validation successful");
      return { valid: true };
    } catch (error) {
      console.log("Chess.js validation threw error:", error);
      return { valid: false, error: `Chess.js validation error: ${error.message}` };
    }
    */
  };

  // CHESS API ANALYSIS ENGINE - ALWAYS USE API
  const analyzeFenPosition = async (fen) => {
    try {
      // Validate FEN first
      const validation = validateFen(fen);
      if (!validation.valid) {
        throw new Error(`Invalid FEN: ${validation.error}`);
      }
      
      console.log('🧠 ENGINE - Analyzing:', fen);
      
      // ALWAYS call Chess API - no exceptions
      const response = await fetch('https://chess-api.com/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fen: fen
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log('✅ Engine response:', apiData);
      
      if (!apiData.move) {
        throw new Error('No move returned from engine');
      }
      
      // Validate the move from API
      const testGame = new Chess();
      testGame.load(fen);
      
      const moveResult = testGame.move(apiData.move);
      if (!moveResult) {
        throw new Error(`Invalid move from API: ${apiData.move}`);
      }
      
      console.log('✅ API move validation passed:', apiData.move);
      
      // Generate professional analysis based on the API move
      const analysis = await generateProfessionalAnalysis(fen, apiData.move, testGame);
      return analysis;
      
    } catch (error) {
      console.error('❌ Engine analysis failed:', error);
      throw error;
    }
  };

  // GENERATE PROFESSIONAL ANALYSIS FROM MOVE
  const generateProfessionalAnalysis = async (originalFen, moveString, gameAfterMove) => {
    console.log('🎯 Generating professional analysis for move:', moveString);
    
    let analysis = moveString;
    let tacticalReasons = [];
    
    // Get the move details
    const moveHistory = gameAfterMove.history({ verbose: true });
    const move = moveHistory[moveHistory.length - 1];
    
        // 🏆 CHECKMATE DETECTION
    if (gameAfterMove.isCheckmate()) {
      return {
        move: moveString,
        analysis: `${moveString} - CHECKMATE! Game over.`
      };
    }
    
    // 🎯 FORCED MATE IN 2 DETECTION
    if (gameAfterMove.inCheck()) {
      const isMateIn2 = testForcedMateIn2(gameAfterMove);
      if (isMateIn2) {
        tacticalReasons.push("FORCED MATE IN 2");
      } else {
        tacticalReasons.push("CHECK");
      }
    }
    
    // 💎 MATERIAL ANALYSIS
    if (move && move.captured) {
      const pieceValues = { 'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900 };
      const captureValue = pieceValues[move.captured] || 0;
      const pieceValue = pieceValues[move.piece] || 0;
      
      if (captureValue > pieceValue) {
        const materialGain = captureValue - pieceValue;
        tacticalReasons.push(`WINS ${move.captured.toUpperCase()} (+${materialGain})`);
      } else if (captureValue === pieceValue) {
        tacticalReasons.push(`TRADES ${move.captured.toUpperCase()}`);
      } else {
        tacticalReasons.push(`SACRIFICE FOR ATTACK`);
      }
    }
    
    // 🎯 TACTICAL PATTERN DETECTION
    const originalGame = new Chess();
    originalGame.load(originalFen);
    const enemyResponses = gameAfterMove.moves({ verbose: true });
    const attackedPieces = enemyResponses.filter(m => m.captured);
    
    // Fork detection
    if (attackedPieces.length >= 2) {
      tacticalReasons.push(`FORK (attacks ${attackedPieces.length} pieces)`);
    }
    
    // 🏰 SPECIAL MOVES
    if (move) {
      if (move.flags.includes('c')) {
        tacticalReasons.push("CASTLING (safety)");
      }
      
      if (move.promotion) {
        tacticalReasons.push(`PROMOTION TO ${move.promotion.toUpperCase()}`);
      }
    }
    
    // 📍 POSITIONAL FACTORS
    const centerSquares = ['e4', 'e5', 'd4', 'd5'];
    if (move && centerSquares.includes(move.to)) {
      tacticalReasons.push("CENTER CONTROL");
    }
    
    // Create final analysis
    if (tacticalReasons.length > 0) {
      analysis += ` - ${tacticalReasons.join(', ')}`;
    } else {
      analysis += " - Strong positional move";
    }
    
    return {
      move: moveString,
      analysis: analysis
    };
  };

  // ACCURATE MATE IN 2 TESTER (STEP-BY-STEP VERIFICATION)
  const testForcedMateIn2 = (gameAfterMove) => {
    console.log('🔍 Testing for forced mate in 2...');
    
    // The position should be in check after our move
    if (!gameAfterMove.inCheck()) {
      console.log('❌ Not in check, cannot be mate in 2');
      return false;
    }
    
    const defenses = gameAfterMove.moves({ verbose: true });
    console.log(`🛡️ Defender has ${defenses.length} legal moves`);
    
    if (defenses.length === 0) {
      console.log('❌ Already checkmate, not mate in 2');
      return false;
    }
    
    // Check EVERY defensive move
    for (let i = 0; i < defenses.length; i++) {
      const defense = defenses[i];
      console.log(`🔍 Testing defense ${i + 1}/${defenses.length}: ${defense.san}`);
      
      gameAfterMove.move(defense);
      
      // After this defense, can we force checkmate?
      const attackerMoves = gameAfterMove.moves({ verbose: true });
      let canCheckmate = false;
      
      for (const attackMove of attackerMoves) {
        gameAfterMove.move(attackMove);
        if (gameAfterMove.isCheckmate()) {
          console.log(`✅ Found checkmate with ${attackMove.san} after ${defense.san}`);
          canCheckmate = true;
        }
        gameAfterMove.undo();
        if (canCheckmate) break;
      }
      
      gameAfterMove.undo();
      
      // If this defense has NO checkmate follow-up, it's not forced mate
      if (!canCheckmate) {
        console.log(`❌ Defense ${defense.san} escapes mate - not forced mate in 2`);
        return false;
      }
    }
    
    console.log('✅ ALL defenses lead to checkmate - TRUE FORCED MATE IN 2!');
    return true;
  };

  // Function to make computer move
  const makeComputerMove = async () => {
    if (isComputerTurn) {
      setMessage("🤖 Computer is thinking...");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Thinking delay
        
        const analysisResult = await analyzeFenPosition(game.fen());
        const bestMove = typeof analysisResult === 'object' ? analysisResult.move : analysisResult;
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move(bestMove);
        
        if (move) {
          setGame(gameCopy);
          setGamePosition(gameCopy.fen());
          
          // Show computer move with analysis if available
          if (typeof analysisResult === 'object' && analysisResult.analysis) {
            setMessage(`🤖 Computer played: ${analysisResult.analysis}`);
          } else {
            setMessage(`🤖 Computer played: ${bestMove}`);
          }
          
          // Check if game is over
          if (gameCopy.isGameOver()) {
            let gameResult = "";
            if (gameCopy.isCheckmate()) {
              gameResult = gameCopy.turn() === userSide ? "💀 You lost by checkmate!" : "🎉 You won by checkmate!";
            } else if (gameCopy.isDraw()) {
              gameResult = "🤝 Game ended in a draw!";
            } else if (gameCopy.isStalemate()) {
              gameResult = "🤝 Game ended in stalemate!";
            }
            
            setMessage(gameResult + " Loading next puzzle...");
            setIsComputerTurn(false);
            
            setTimeout(() => {
              loadNextPuzzle();
            }, 2000);
            return;
          }
          
          // Check if it's user's turn again
          if (gameCopy.turn() === userSide) {
            setIsComputerTurn(false);
            // Get next best move for user but don't auto-analyze
            try {
              const nextBestMove = await analyzeFenPosition(gameCopy.fen());
              setAutoCorrectMove(nextBestMove);
            } catch (error) {
              console.error('Error analyzing next position:', error);
            }
            setMessage(`Your turn! Make your move.`);
            // Don't reset hint used here - let user decide when to see hint
          } else {
            // Computer continues playing
            setTimeout(() => {
              makeComputerMove();
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Computer move error:', error);
        setMessage("❌ Computer move failed. Moving to next puzzle...");
        setIsComputerTurn(false);
        setTimeout(() => {
          loadNextPuzzle();
        }, 1500);
      }
    }
  };

  // UseEffect to trigger computer moves
  useEffect(() => {
    if (isComputerTurn && isGameSetup) {
      makeComputerMove();
    }
  }, [isComputerTurn, isGameSetup]);

  // Function to load the next puzzle in the set with validation
  const loadNextPuzzle = async () => {
    if (currentFenIndex < fenSet.length - 1) {
      const nextIndex = currentFenIndex + 1;
      setCurrentFenIndex(nextIndex);
      const nextFen = fenSet[nextIndex];
      
      // Auto-analyze the next position
      setIsAnalyzing(true);
      
      try {
        // Validate the next FEN
        const validation = validateFen(nextFen);
        if (!validation.valid) {
          throw new Error(`Invalid FEN: ${validation.error}`);
        }
        
        const bestMove = await analyzeFenPosition(nextFen);
        setAutoCorrectMove(bestMove);
        
        // Set up the next game
        const newGame = new Chess();
        newGame.load(nextFen);
        setUserSide(newGame.turn()); // User plays the side to move
        
        setGame(newGame);
        setGamePosition(newGame.fen());
        setBoardKey(prev => prev + 1);
        setIsComputerTurn(false);
        setHintUsed(false);
        setUserMoveCount(0); // Reset user move count for new puzzle
        
        setMessage(`Puzzle ${nextIndex + 1}/${fenSet.length} - Your turn as ${newGame.turn() === 'w' ? 'White' : 'Black'}!`);
        
      } catch (error) {
        console.error('Error loading next puzzle:', error);
        setMessage(`Error loading puzzle ${nextIndex + 1}: ${error.message}. Skipping to next...`);
        // Try to skip to the next puzzle
        setTimeout(() => {
          loadNextPuzzle();
        }, 1500);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // All puzzles completed
      setMessage("🎉 Congratulations! You've completed all puzzles in this set!");
      setIsGameSetup(false);
    }
  };

  // Function to parse FEN set input with improved validation and debugging
  const parseFenSet = (input) => {
    console.log("Parsing FEN input:", input);
    
    if (!input || typeof input !== 'string') {
      console.log("Invalid input: not a string or empty");
      return [];
    }
    
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log("Found lines:", lines);
    
    const validFens = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Validating line ${i + 1}: "${line}"`);
      
      const validation = validateFen(line);
      if (validation.valid) {
        validFens.push(line);
        console.log(`✅ Line ${i + 1} is valid`);
      } else {
        console.warn(`❌ Line ${i + 1} is invalid: ${validation.error}`);
      }
    }
    
    console.log("Valid FENs found:", validFens);
    return validFens;
  };

  const setupGameWithFen = async (fenInput) => {
    console.log("setupGameWithFen called with:", JSON.stringify(fenInput));
    
    if (!fenInput || fenInput.trim() === '') {
      setMessage("Please enter FEN notation(s)!");
      console.log("Setup aborted: no input");
      return;
    }
    
    // Update the state for consistency
    setInputFen(fenInput);
    
    // Parse FEN input - could be single FEN or multiple FENs
    const fenList = parseFenSet(fenInput);
    
    console.log("Parsed FEN list:", fenList);
    
    if (fenList.length === 0) {
      // Provide more specific error message
      const lines = fenInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length === 0) {
        setMessage("Please enter at least one FEN position!");
      } else {
        // Check what's wrong with the first line
        const firstLine = lines[0];
        console.log("Validating first line:", firstLine);
        const validation = validateFen(firstLine);
        console.log("First line validation:", validation);
        setMessage(`No valid FEN positions found! First line error: ${validation.error}. Please check your input format.`);
      }
      return;
    }
    
    console.log(`Found ${fenList.length} valid FEN position(s)`);
    
    // Set up for multiple FENs
    setFenSet(fenList);
    setOriginalFenSet(fenList); // Store original for reset functionality
    setCurrentFenIndex(0);
    setCompletedPuzzles(0);
    
    const firstFen = fenList[0];
    
    // Auto-analyze the first position
    setIsAnalyzing(true);
    
    try {
      const bestMove = await analyzeFenPosition(firstFen);
      setAutoCorrectMove(bestMove);
      setMessage(`Best move found: ${bestMove} (auto-analysis complete)`);
      
      // Set up the game with validated FEN
      const newGame = new Chess();
      newGame.load(firstFen);
      
      // Set user side as the side to move
      setUserSide(newGame.turn());
      
      // Set up the first game
      setGame(newGame);
      const newFen = newGame.fen();
      setGamePosition(newFen);
      setBoardKey(prev => prev + 1);
      setIsGameSetup(true);
      setIsComputerTurn(false);
      setHintUsed(false);
      
      if (fenList.length === 1) {
        setMessage(`Game set up successfully! You are playing as ${newGame.turn() === 'w' ? 'White' : 'Black'}.`);
      } else {
        setMessage(`Puzzle set loaded! Starting puzzle 1/${fenList.length} - You are ${newGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
      }
      
    } catch (error) {
      console.error("Analysis or setup error:", error);
      setMessage(`Could not analyze the position: ${error.message}. Please check the FEN format.`);
      setIsAnalyzing(false);
      return;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setupGame = async () => {
    
  
    // Parse FEN input - could be single FEN or multiple FENs
    const fenList = parseFenSet(inputFen);
    
    console.log("Parsed FEN list:", fenList);
    
    if (fenList.length === 0) {
      // Provide more specific error message
      const lines = inputFen.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length === 0) {
        setMessage("Please enter at least one FEN position!");
      } else {
        // Check what's wrong with the first line
        const firstLine = lines[0];
        console.log("Validating first line:", firstLine);
        const validation = validateFen(firstLine);
        console.log("First line validation:", validation);
        setMessage(`No valid FEN positions found! First line error: ${validation.error}. Please check your input format.`);
      }
      return;
    }
    
    console.log(`Found ${fenList.length} valid FEN position(s)`);
    
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
      setMessage(`Best move found: ${bestMove} (engine analysis complete)`);
      
      // Set up the game with validated FEN
      const newGame = new Chess();
      newGame.load(firstFen);
      
      // Set user side as the side to move
      setUserSide(newGame.turn());
      
      // Set up the first game
      setGame(newGame);
      const newFen = newGame.fen();
      setGamePosition(newFen);
      setBoardKey(prev => prev + 1);
      setIsGameSetup(true);
      setIsComputerTurn(false);
      setHintUsed(false);
      
      if (fenList.length === 1) {
        setMessage(`Game set up successfully! You are playing as ${newGame.turn() === 'w' ? 'White' : 'Black'}.`);
      } else {
        setMessage(`Puzzle set loaded! Starting puzzle 1/${fenList.length} - You are ${newGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
      }
      
    } catch (error) {
      console.error("Analysis or setup error:", error);
      setMessage(`Could not analyze the position: ${error.message}. Please check the FEN format.`);
      setIsAnalyzing(false);
      return;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetGame = () => {
    // Reset to current puzzle position instead of default starting position
    if (originalFenSet.length > 0 && currentFenIndex < originalFenSet.length) {
      const currentFen = originalFenSet[currentFenIndex];
      const newGame = new Chess();
      newGame.load(currentFen);
      setGame(newGame);
      setGamePosition(newGame.fen());
      setBoardKey(prev => prev + 1);
      setUserMoveCount(0);
      setHintUsed(false);
      setShowVisualHint(false);
      setPendingMove(null);
      setShowMoveConfirmation(false);
      setMessage("Position reset to starting state of current puzzle.");
    } else {
      // Fallback to default reset
      setGame(new Chess());
      setGamePosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      setBoardPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
      setInputFen("");
      setFenSet([]);
      setOriginalFenSet([]);
      setCurrentFenIndex(0);
      setAutoCorrectMove("");
      setCompletedPuzzles(0);
      setMessage("");
      setIsGameSetup(false);
      setTargetGame(null);
      setIsComputerTurn(false);
      setUserSide('w');
      setHintUsed(false);
      setUserMoveCount(0);
      setPendingMove(null);
      setShowMoveConfirmation(false);
      setPuzzleTitle("");
      setPuzzleLevel("");
    }
  };

  // Function to proceed with pending move
  const proceedWithMove = () => {
    if (pendingMove) {
      const { gameCopy, move } = pendingMove;
      
      // Execute the move
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setCompletedPuzzles(prev => prev + 1);
      setUserMoveCount(prev => prev + 1);
      
      // Clear confirmation dialog
      setShowMoveConfirmation(false);
      setPendingMove(null);
      
      // Check if game is over after user's move
      if (gameCopy.isGameOver()) {
        let gameResult = "";
        if (gameCopy.isCheckmate()) {
          gameResult = gameCopy.turn() !== userSide ? "🎉 You won by checkmate!" : "💀 You lost by checkmate!";
        } else if (gameCopy.isDraw()) {
          gameResult = "🤝 Game ended in a draw!";
        } else if (gameCopy.isStalemate()) {
          gameResult = "🤝 Game ended in stalemate!";
        }
        
        setMessage(gameResult + " Loading next puzzle...");
        setTimeout(() => {
          loadNextPuzzle();
        }, 2000);
        return;
      }
      
      // Check if it's computer's turn
      if (gameCopy.turn() !== userSide) {
        setMessage(getSuccessMessage(move.san));
        setIsComputerTurn(true);
      } else {
        setMessage(getSuccessMessage(move.san));
        // Get next best move but don't reset hint automatically
        setTimeout(async () => {
          try {
            const nextBestMove = await analyzeFenPosition(gameCopy.fen());
            setAutoCorrectMove(nextBestMove);
          } catch (error) {
            console.error('Error analyzing next position:', error);
          }
        }, 500);
      }
    }
  };

  // Function to cancel pending move
  const cancelMove = () => {
    setShowMoveConfirmation(false);
    setPendingMove(null);
    setMessage("Move cancelled. Try again.");
  };

  const showHint = () => {
    if (autoCorrectMove && !hintUsed) {
      // Show visual hint on board instead of text
      setShowVisualHint(true);
      setHintUsed(true);
      
      // Also show a brief text message
      let moveToShow;
      if (typeof autoCorrectMove === 'object' && autoCorrectMove.move) {
        moveToShow = autoCorrectMove.move;
      } else if (typeof autoCorrectMove === 'string') {
        moveToShow = autoCorrectMove;
      } else {
        moveToShow = autoCorrectMove;
      }
      
      setMessage(`💡 VISUAL HINT: Best move highlighted on board (${moveToShow})`);
      
      // Hide visual hint after 5 seconds
      setTimeout(() => {
        setShowVisualHint(false);
      }, 5000);
    } else if (hintUsed) {
      // Show hint again if already used
      setShowVisualHint(true);
      setTimeout(() => {
        setShowVisualHint(false);
      }, 5000);
      setMessage(`💡 Hint shown again on board`);
    } else {
      setMessage("❌ No hint available for this position.");
    }
  };

  const onDrop = useCallback((sourceSquare, targetSquare) => {
    console.log('=== onDrop CALLED ===');
    console.log('sourceSquare:', sourceSquare);
    console.log('targetSquare:', targetSquare);
    console.log('userMoveCount:', userMoveCount);
    console.log('autoCorrectMove:', autoCorrectMove);
    console.log('isComputerTurn:', isComputerTurn);
    console.log('userSide:', userSide);
    console.log('game.turn():', game.turn());
    
    // Don't allow moves during computer's turn
    if (isComputerTurn) {
      setMessage("⏳ Please wait for computer's move...");
      return false;
    }

    // Only allow moves if it's user's turn
    if (game.turn() !== userSide) {
      setMessage("⏳ It's not your turn!");
      return false;
    }

    // Prevent move if best move (hint) is not ready
    if (game.history().length === 0 && !autoCorrectMove) {
      setMessage("Please wait for the best move to be calculated before making your move.");
      return false;
    }

    try {
      const gameCopy = new Chess(game.fen());
      let moveObj = { from: sourceSquare, to: targetSquare };
      let move;
      try {
        move = gameCopy.move(moveObj);
      } catch (moveError) {
        // If move failed, it might be a pawn promotion
        const piece = game.get(sourceSquare);
        const toRank = targetSquare[1];
        if (piece && piece.type === 'p' && (toRank === '8' || toRank === '1')) {
          try {
            moveObj.promotion = 'q';
            move = gameCopy.move(moveObj);
          } catch (promotionError) {
            move = null;
          }
        } else {
          move = null;
        }
      }

      // If move is still invalid
      if (!move) {
        setMessage("Invalid move! Try again.");
        return false;
      }

      // Only allow the best move for the first user move (use userMoveCount instead of game history)
      if (userMoveCount === 0) {
        console.log('=== FIRST MOVE VALIDATION (STRICT) ===');
        console.log('User move count:', userMoveCount);
        console.log('Game history length:', game.history().length);
        console.log('User move SAN:', move.san);
        console.log('Expected best move:', autoCorrectMove);
        console.log('autoCorrectMove exists:', !!autoCorrectMove);
        
        if (!autoCorrectMove) {
          console.log('No best move available - blocking move');
          setMessage("Please wait for the best move to be calculated.");
          return false;
        }
        
        // Extract move from analysis object if needed
        let expectedMove;
        if (typeof autoCorrectMove === 'object' && autoCorrectMove.move) {
          expectedMove = autoCorrectMove.move;
        } else if (typeof autoCorrectMove === 'string') {
          expectedMove = autoCorrectMove;
        } else {
          expectedMove = autoCorrectMove;
        }
        
        // Compare moves - try multiple formats for robust matching
        const userMoveSan = move.san.replace(/\s+/g, '').toLowerCase();
        const bestMoveSan = expectedMove.replace(/\s+/g, '').toLowerCase();
        
        // Also compare the actual from-to squares directly (coordinate notation)
        const userFromTo = `${sourceSquare}${targetSquare}`.toLowerCase();
        const expectedFromTo = expectedMove.length >= 4 ? expectedMove.toLowerCase() : '';
        
        console.log('=== MOVE COMPARISON ===');
        console.log('User move SAN (normalized):', userMoveSan);
        console.log('Expected move SAN (normalized):', bestMoveSan);
        console.log('User from-to coordinates:', userFromTo);
        console.log('Expected from-to coordinates:', expectedFromTo);
        console.log('SAN match:', userMoveSan === bestMoveSan);
        console.log('Coordinate match:', userFromTo === expectedFromTo);
        
        // Check if moves match (either SAN notation or coordinate notation)
        const movesMatch = (userMoveSan === bestMoveSan) || (expectedFromTo && userFromTo === expectedFromTo);
        
        if (!movesMatch) {
          console.log('❌ MOVE REJECTED - Does not match best move');
          setMessage(getErrorMessage());
          return false;
        }
        console.log('✅ MOVE ACCEPTED - Matches best move');
      } else {
        // For subsequent moves (after first move), check if it's the best move
        console.log('=== SUBSEQUENT MOVE VALIDATION (FLEXIBLE) ===');
        console.log('User move count:', userMoveCount);
        console.log('User move SAN:', move.san);
        console.log('Expected best move:', autoCorrectMove);
        
        if (autoCorrectMove) {
          // Extract move from analysis object if needed
          let expectedMove;
          if (typeof autoCorrectMove === 'object' && autoCorrectMove.move) {
            expectedMove = autoCorrectMove.move;
          } else if (typeof autoCorrectMove === 'string') {
            expectedMove = autoCorrectMove;
          } else {
            expectedMove = autoCorrectMove;
          }
          
          // Compare moves
          const userMoveSan = move.san.replace(/\s+/g, '').toLowerCase();
          const bestMoveSan = expectedMove.replace(/\s+/g, '').toLowerCase();
          const userFromTo = `${sourceSquare}${targetSquare}`.toLowerCase();
          const expectedFromTo = expectedMove.length >= 4 ? expectedMove.toLowerCase() : '';
          
          const movesMatch = (userMoveSan === bestMoveSan) || (expectedFromTo && userFromTo === expectedFromTo);
          
          if (!movesMatch) {
            // Store pending move and show confirmation dialog
            setPendingMove({ gameCopy, move });
            setShowMoveConfirmation(true);
            setMessage(`⚠️ This is not the best move!. Do you want to proceed with your move?`);
            return false; // Don't execute the move yet
          }
        }
      }

      // Any legal move is accepted - update the board
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setCompletedPuzzles(prev => prev + 1);
      setUserMoveCount(prev => prev + 1); // Increment user move count
      
      // Check if game is over after user's move
      if (gameCopy.isGameOver()) {
        let gameResult = "";
        if (gameCopy.isCheckmate()) {
          gameResult = gameCopy.turn() !== userSide ? "🎉 You won by checkmate!" : "💀 You lost by checkmate!";
        } else if (gameCopy.isDraw()) {
          gameResult = "🤝 Game ended in a draw!";
        } else if (gameCopy.isStalemate()) {
          gameResult = "🤝 Game ended in stalemate!";
        }
        
        setMessage(gameResult + " Loading next puzzle...");
        setTimeout(() => {
          loadNextPuzzle();
        }, 2000);
        return true;
      }
      
      // Check if it's computer's turn
      if (gameCopy.turn() !== userSide) {
        setMessage(getSuccessMessage(move.san));
        setIsComputerTurn(true);
      } else {
        setMessage(getSuccessMessage(move.san));
        setTimeout(async () => {
          try {
            const nextBestMove = await analyzeFenPosition(gameCopy.fen());
            setAutoCorrectMove(nextBestMove);
          } catch (error) {
            console.error('Error analyzing next position:', error);
          }
        }, 500);
      }
      
      return true;

    } catch (error) {
      console.error("Move error:", error);
      setMessage("Error making move. Try again.");
      return false;
    }
  }, [game, userSide, isComputerTurn, autoCorrectMove]);

  // Navigation functions
  const goToPreviousPuzzle = () => {
    if (currentFenIndex > 0) {
      const prevIndex = currentFenIndex - 1;
      setCurrentFenIndex(prevIndex);
      const prevFen = originalFenSet[prevIndex];
      
      const newGame = new Chess();
      newGame.load(prevFen);
      setGame(newGame);
      setGamePosition(newGame.fen());
      setUserSide(newGame.turn());
      setBoardKey(prev => prev + 1);
      setUserMoveCount(0);
      setHintUsed(false);
      setShowVisualHint(false);
      setMessage(`Moved to puzzle ${prevIndex + 1}/${originalFenSet.length}`);
      
      // Analyze the position
      analyzeFenPosition(prevFen).then(bestMove => {
        setAutoCorrectMove(bestMove);
      }).catch(error => {
        console.error('Error analyzing previous puzzle:', error);
      });
    }
  };

  const goToNextPuzzle = () => {
    if (currentFenIndex < originalFenSet.length - 1) {
      loadNextPuzzle();
    } else {
      // All puzzles completed - redirect to home
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Get professional feedback messages
  const getSuccessMessage = (move) => {
    const messages = [
      `Woohoo! Nice move - you're awesome! That's the kind of move real champions make! 🏆`,
      `Excellent! That was brilliant! You're playing like a true chess master! ⭐`,
      `Perfect move! You've got the champion's instinct! 🎯`,
      `Outstanding! That's exactly what a chess champion would play! 👑`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getErrorMessage = () => {
    return "Uh oh! The move wasn't the best move - Let's try again! 🤔";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {puzzleTitle || "Chess Training"}
        </h1>
        {puzzleLevel && (
          <p className="text-lg text-gray-600 capitalize">
            Level: {puzzleLevel}
          </p>
        )}
      </div>

      {/* Player Turn Bar */}
      <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="mx-4 mb-4 rounded-lg">
        <div className="py-3 px-6 text-center">
          <p className="text-white font-semibold text-lg">
            {isComputerTurn ? "🤖 Computer's Turn" : `${userSide === 'w' ? 'White' : 'Black'} to Move`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {fenSet.length > 1 && (
        <div className="mx-4 mb-6">
          <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="rounded-lg py-2 px-4">
            <p className="text-white text-center font-medium">
              Puzzle {currentFenIndex + 1}/{fenSet.length}
            </p>
          </div>
        </div>
      )}

      {/* Chess Board Container */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md mx-4">
          <CustomChessboard
            position={game.fen().split(' ')[0]}
            currentPlayer="w"
            onMove={(sourceSquare, targetSquare) => {
              console.log('Custom board move:', sourceSquare, 'to', targetSquare);
              return onDrop(sourceSquare, targetSquare);
            }}
            boardKey={boardKey}
            disabled={isComputerTurn}
            showVisualHint={showVisualHint}
            hintMove={autoCorrectMove}
          />
        </div>
      </div>

      {/* Feedback Message Bar */}
      <div className="mx-4 mb-6">
        <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="rounded-lg py-4 px-6">
          <p className="text-white text-center font-medium">
            {message || "Make your move!"}
          </p>
          {showMoveConfirmation && (
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={proceedWithMove}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ✅ Yes, Proceed
              </button>
              <button
                onClick={cancelMove}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-2">
        {/* Try Again Button */}
        <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="rounded-lg">
          <button
            onClick={resetGame}
            className="w-full py-4 px-2 text-white font-semibold hover:bg-gray-600 transition-colors rounded-lg"
          >
            Try Again
          </button>
        </div>

        {/* Show Hint Button */}
        <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="rounded-lg">
          <button
            onClick={showHint}
            disabled={isComputerTurn || !autoCorrectMove}
            className="w-full py-4 px-2 text-white font-semibold hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            💡 Show Hint
          </button>
        </div>

        {/* Explanation Button */}
        <div style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="rounded-lg">
          <button
            onClick={() => window.open('https://youtube.com', '_blank')}
            className="w-full py-4 px-2 text-white font-semibold hover:bg-gray-600 transition-colors rounded-lg"
          >
            📺 Explanation
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mx-4 mb-8 flex justify-between items-center">
        <button
          onClick={goToPreviousPuzzle}
          disabled={currentFenIndex === 0}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
        >
          ← Previous
        </button>

        <div className="flex-1 text-center">
          <p className="text-gray-600 font-medium">
            {currentFenIndex + 1} of {fenSet.length}
          </p>
        </div>

        <button
          onClick={goToNextPuzzle}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          {currentFenIndex < originalFenSet.length - 1 ? 'Next →' : 'Home 🏠'}
        </button>
      </div>
    </div>
  );
}

