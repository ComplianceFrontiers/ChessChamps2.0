
"use client";
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
// Chess piece Unicode symbols with better styling
const pieces = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};
// Get piece color for styling
const getPieceColor = (piece) => {
  if (!piece) return '';
  return piece === piece.toUpperCase() ? '#ffffff' : '#000000'; // White pieces white, black pieces black
};
// Get text shadow for better visibility
const getTextShadow = (piece) => {
  if (!piece) return '';
  return piece === piece.toUpperCase() 
    ? '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)' // White pieces: dark shadow
    : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8)'; // Black pieces: light shadow
};
// Convert FEN position to 8x8 board array
function fenToBoard(fen) {
  const board = [];
  const rows = fen.split('/');
  
  for (let row of rows) {
    const boardRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        boardRow.push(char);
      } else {
        // Add empty squares
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push('');
        }
      }
    }
    board.push(boardRow);
  }
  return board;
}
function getValidMoves(position, square, currentPlayer) {
  try {
    const tempGame = new Chess();
    // Load the position - need to reconstruct full FEN with correct turn
    const fullFen = position + ` ${currentPlayer} KQkq - 0 1`;
    tempGame.load(fullFen);
    // Get all possible moves from this square
    const moves = tempGame.moves({ square: square, verbose: true });
    return moves.map(move => move.to);
  } catch (error) {
    console.error('Error getting valid moves:', error);
    return [];
  }
}
export default function CustomChessboard({ position, onMove, boardKey, currentPlayer = 'w', showVisualHint = false, hintMove = null }) {
  const [board, setBoard] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragOverSquare, setDragOverSquare] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [hintFromSquare, setHintFromSquare] = useState(null);
  const [hintToSquare, setHintToSquare] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get responsive sizes based on screen size
  const getResponsiveSizes = () => {
    if (typeof window === 'undefined') return { squareSize: 50, fontSize: 36, coordinateWidth: 20, coordinateFontSize: 12 };
    
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 380) {
      // Extra small phones
      return {
        squareSize: 35,
        fontSize: 24,
        coordinateWidth: 15,
        coordinateFontSize: 9,
        padding: 4
      };
    } else if (screenWidth < 480) {
      // Small phones
      return {
        squareSize: 40,
        fontSize: 28,
        coordinateWidth: 16,
        coordinateFontSize: 10,
        padding: 6
      };
    } else if (screenWidth < 768) {
      // Large phones / small tablets
      return {
        squareSize: 45,
        fontSize: 32,
        coordinateWidth: 18,
        coordinateFontSize: 11,
        padding: 6
      };
    } else {
      // Desktop
      return {
        squareSize: 50,
        fontSize: 36,
        coordinateWidth: 20,
        coordinateFontSize: 12,
        padding: 8
      };
    }
  };

  const sizes = getResponsiveSizes();
  useEffect(() => {
    console.log('CustomChessboard received currentPlayer:', currentPlayer);
  }, [currentPlayer]);
  useEffect(() => {
    console.log('Setting board position to:', position);
    setBoard(fenToBoard(position));
    // Clear selection when position changes
    setSelectedSquare(null);
    setValidMoves([]);
  }, [position, boardKey]);

  // Parse hint move when showVisualHint changes
  useEffect(() => {
    if (showVisualHint && hintMove) {
      let moveStr;
      if (typeof hintMove === 'object' && hintMove.move) {
        moveStr = hintMove.move;
      } else if (typeof hintMove === 'string') {
        moveStr = hintMove;
      } else {
        moveStr = hintMove;
      }
      
      // Parse coordinate notation like "f6a6"
      if (moveStr && moveStr.length >= 4) {
        const fromSquare = moveStr.substring(0, 2);
        const toSquare = moveStr.substring(2, 4);
        setHintFromSquare(fromSquare);
        setHintToSquare(toSquare);
      }
    } else {
      setHintFromSquare(null);
      setHintToSquare(null);
    }
  }, [showVisualHint, hintMove]);

  const handleSquareClick = (row, col, piece) => {
    // Adjust coordinates if board is flipped for black
    const actualRow = currentPlayer === 'b' ? 7 - row : row;
    const actualCol = currentPlayer === 'b' ? 7 - col : col;
    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
    
    console.log('Square clicked:', square, 'piece:', piece, 'currentPlayer:', currentPlayer);
    console.log('Display row/col:', row, col, 'Actual row/col:', actualRow, actualCol);
    
    if (selectedSquare === square) {
      // Clicking the same square deselects it
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (selectedSquare && validMoves.includes(square)) {
      // Clicking a valid move square - make the move
      const result = onMove(selectedSquare, square);
      if (result) {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece) {
      // Clicking a piece - select it and show valid moves
      setSelectedSquare(square);
      const moves = getValidMoves(position, square, currentPlayer);
      setValidMoves(moves);
      console.log('Valid moves for', square, ':', moves);
    } else {
      // Clicking empty square when no piece selected
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const handleDragStart = (e, row, col, piece) => {
    if (!piece) return;
    setDraggedPiece(piece);
    setDraggedFrom({ row, col });
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
    
    // Also show valid moves when dragging starts
    const actualRow = currentPlayer === 'b' ? 7 - row : row;
    const actualCol = currentPlayer === 'b' ? 7 - col : col;
    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
    const moves = getValidMoves(position, square, currentPlayer);
    setValidMoves(moves);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDragOverSquare(null);
    setValidMoves([]); // Clear valid moves when drag ends
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, row, col) => {
    e.preventDefault();
    setDragOverSquare(`${row}-${col}`);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverSquare(null);
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    setDragOverSquare(null);
    
    if (!draggedPiece || !draggedFrom) return;
    
    // Adjust coordinates if board is flipped for black
    const fromActualRow = currentPlayer === 'b' ? 7 - draggedFrom.row : draggedFrom.row;
    const fromActualCol = currentPlayer === 'b' ? 7 - draggedFrom.col : draggedFrom.col;
    const toActualRow = currentPlayer === 'b' ? 7 - row : row;
    const toActualCol = currentPlayer === 'b' ? 7 - col : col;
    
    const from = String.fromCharCode(97 + fromActualCol) + (8 - fromActualRow);
    const to = String.fromCharCode(97 + toActualCol) + (8 - toActualRow);
    
    console.log('Drop:', from, 'to', to);
    
    if (onMove) {
      const result = onMove(from, to);
      if (result) {
        // Move was successful, board will be updated via position prop
      }
    }
    
    setDraggedPiece(null);
    setDraggedFrom(null);
  };

  const getSquareColor = (row, col) => {
    return (row + col) % 2 === 0 ? '#e1eaf0' : '#6b8eac'; // New color scheme: light and dark blue squares
  };

  const getSquareStyle = (row, col, piece, isDragOver) => {
    // Adjust coordinates if board is flipped for black
    const actualRow = currentPlayer === 'b' ? 7 - row : row;
    const actualCol = currentPlayer === 'b' ? 7 - col : col;
    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);
    const isHintFrom = hintFromSquare === square;
    const isHintTo = hintToSquare === square;
    const baseColor = getSquareColor(row, col);
    
    let backgroundColor = baseColor;
    let border = 'none';
    let boxShadow = 'none';
    
    if (isHintFrom) {
      // Hint from square - use same style as selected piece
      backgroundColor = '#fbbf24'; // Same yellow as selected piece
      border = '3px solid #f59e0b';
    } else if (isHintTo) {
      // Hint to square - use same style as valid move to empty square
      backgroundColor = '#86efac'; // Same light green as valid moves
      border = '2px solid #22c55e';
    } else if (isSelected) {
      backgroundColor = '#fbbf24'; // Yellow for selected piece
      border = '3px solid #f59e0b';
    } else if (isValidMove) {
      if (piece) {
        // Enemy piece that can be captured
        border = '3px solid #ef4444';
        boxShadow = 'inset 0 0 0 3px #ef4444';
      } else {
        // Empty square that can be moved to
        backgroundColor = '#86efac'; // Light green
        border = '2px solid #22c55e';
      }
    } else if (isDragOver) {
      border = '2px solid #4ade80';
    }
    
    return {
      width: `${sizes.squareSize}px`,
      height: `${sizes.squareSize}px`,
      backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${sizes.fontSize}px`,
      fontWeight: 'bold',
      cursor: piece || isValidMove ? 'pointer' : 'default',
      userSelect: 'none',
      color: getPieceColor(piece),
      textShadow: getTextShadow(piece),
      border,
      boxShadow,
      transition: 'all 0.3s ease',
      position: 'relative'
    };
  };

  // Get the board array, flipped if playing as black
  const displayBoard = currentPlayer === 'b' ? [...board].reverse().map(row => [...row].reverse()) : board;
  
  // Get coordinate labels based on current player perspective
  const files = currentPlayer === 'b' ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] :
   ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = currentPlayer === 'b' ? [1, 2, 3, 4, 5, 6, 7, 8] :
   [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{ 
        display: 'inline-block', 
        borderRadius: '8px',
        padding: `${sizes.padding}px`,
        backgroundColor: '#1f2937', // Overall background color
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
      {/* Coordinate labels - letters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `${sizes.coordinateWidth}px repeat(8, ${sizes.squareSize}px) ${sizes.coordinateWidth}px`,
        marginBottom: '4px'
      }}>
        <div></div>
        {files.map(letter => (
          <div key={letter} style={{
            textAlign: 'center',
            fontSize: `${sizes.coordinateFontSize}px`,
            fontWeight: 'bold',
            color: '#e1eaf0' // Light coordinate text
          }}>
            {letter}
          </div>
        ))}
        <div></div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left number column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          width: `${sizes.coordinateWidth}px`,
          marginRight: '4px'
        }}>
          {ranks.map(num => (
            <div key={num} style={{
              height: `${sizes.squareSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${sizes.coordinateFontSize}px`,
              fontWeight: 'bold',
              color: '#e1eaf0' // Light coordinate text
            }}>
              {num}
            </div>
          ))}
        </div>

        {/* Chess board */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(8, ${sizes.squareSize}px)`,
          gridTemplateRows: `repeat(8, ${sizes.squareSize}px)`,
          gap: '0',
          border: '2px solid #4b5563' // Button color for board border
        }}>
          {displayBoard.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const squareKey = `${rowIndex}-${colIndex}`;
              const isDragOver = dragOverSquare === squareKey;
              
              // For the valid move indicator, we need to calculate the actual square
              const actualRow = currentPlayer === 'b' ? 7 - rowIndex : rowIndex;
              const actualCol = currentPlayer === 'b' ? 7 - colIndex : colIndex;
              const actualSquare = String.fromCharCode(97 + actualCol) + (8 - actualRow);
              
              // Check if this square is part of the hint
              const isHintFrom = hintFromSquare === actualSquare;
              const isHintTo = hintToSquare === actualSquare;
              
              return (
                <div
                  key={squareKey}
                  style={getSquareStyle(rowIndex, colIndex, piece, isDragOver)}
                  draggable={!!piece}
                  onClick={() => handleSquareClick(rowIndex, colIndex, piece)}
                  onDragStart={(e) => handleDragStart(e, rowIndex, colIndex, piece)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, rowIndex, colIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {pieces[piece] || ''}
                  {/* Add a dot indicator for valid moves on empty squares */}
                  {!piece && validMoves.includes(actualSquare) && (
                    <div style={{
                      position: 'absolute',
                      width: `${Math.max(8, sizes.squareSize * 0.2)}px`,
                      height: `${Math.max(8, sizes.squareSize * 0.2)}px`,
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      opacity: 0.8
                    }} />
                  )}
                  {/* Add hint dot indicator only for the target square */}
                  {!piece && isHintTo && (
                    <div style={{
                      position: 'absolute',
                      width: `${Math.max(8, sizes.squareSize * 0.2)}px`,
                      height: `${Math.max(8, sizes.squareSize * 0.2)}px`,
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      opacity: 0.8
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right number column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          width: `${sizes.coordinateWidth}px`,
          marginLeft: '4px'
        }}>
          {ranks.map(num => (
            <div key={num} style={{
              height: `${sizes.squareSize}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${sizes.coordinateFontSize}px`,
              fontWeight: 'bold',
              color: '#e1eaf0' // Light coordinate text
            }}>
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom coordinate labels - letters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `${sizes.coordinateWidth}px repeat(8, ${sizes.squareSize}px) ${sizes.coordinateWidth}px`,
        marginTop: '4px'
      }}>
        <div></div>
        {files.map(letter => (
          <div key={letter} style={{
            textAlign: 'center',
            fontSize: `${sizes.coordinateFontSize}px`,
            fontWeight: 'bold',
            color: '#e1eaf0' // Light coordinate text
          }}>
            {letter}
          </div>
        ))}
        <div></div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        fontSize: `${Math.max(8, sizes.coordinateFontSize - 1)}px`, 
        color: '#e1eaf0', // Light text color
        marginTop: '8px',
        backgroundColor: '#374151', // UI panel color
        padding: '4px',
        borderRadius: '4px',
        wordBreak: 'break-word',
        lineHeight: '1.2'
      }}>
        Position: {position} {currentPlayer === 'b' ? '(Black\'s perspective)' : '(White\'s perspective)'}
      </div>
    </div>
    </>
  );
}


