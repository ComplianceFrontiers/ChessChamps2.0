"use client";

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

// Chess piece Unicode symbols with better styling
const pieces = {
  "k": "♚", "q": "♛", "r": "♜", "b": "♝", "n": "♞", "p": "♟",
  "K": "♔", "Q": "♕", "R": "♖", "B": "♗", "N": "♘", "P": "♙"
};

// Get piece color for styling
const getPieceColor = (piece) => {
  if (!piece) return;
  return piece === piece.toUpperCase() ? '#ffffff' : '#000000';
};

// Get text shadow for better visibility
const getTextShadow = (piece) => {
  if (!piece) return "";
  return piece === piece.toUpperCase()
    ? '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8)' // white pieces: dark shadow
    : '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)'; // black pieces: light shadow
};

// Convert FEN position to 8x8 board array
function fenToBoard(fen) {
  const board = [];
  const rows = fen.split("/");
  for (let row of rows) {
    const boardRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        boardRow.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push("");
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
    const fullFen = position + ` ${currentPlayer} - - 0 1`;
    tempGame.load(fullFen);
    const moves = tempGame.moves({ square: square, verbose: true });
    return moves.map(move => move.to);
  } catch (error) {
    console.error('Error getting valid moves:', error);
    return [];
  }
}

export default function CustomChessboard({ position, onMove, boardKey, currentPlayer = 'w' }) 
{
  const [board, setBoard] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragOverSquare, setDragOverSquare] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  useEffect(() => {
    console.log('CustomChessboard received currentPlayer:', currentPlayer);
  }, [currentPlayer]);

  useEffect(() => {
    console.log('Setting board position to:', position);
    setBoard(fenToBoard(position));
    setSelectedSquare(null);
    setValidMoves([]);
  }, [position, boardKey]);

  const handleSquareClick = (row, col, piece) => {
    // Adjust coordinates if board is flipped for black
    const actualRow = currentPlayer === 'b' ? 7 - row : row;
    const actualCol = currentPlayer === 'b' ? 7 - col : col;
    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);

    console.log('Square clicked:', square, 'piece:', piece, 'currentPlayer:', currentPlayer);
    console.log("Display row/col:", row, col, "Actual row/col:", actualRow, actualCol);

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
      console.log("Valid moves for", square, "is", moves);
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
    // Calculate actual positions for drag-from and drop-to
const fromActualRow = currentPlayer === 'b' ? 7 - draggedFrom.row : draggedFrom.row;
const fromActualCol = currentPlayer === 'b' ? 7 - draggedFrom.col : draggedFrom.col;
const toActualRow = currentPlayer === 'b' ? 7 - row : row;
const toActualCol = currentPlayer === 'b' ? 7 - col : col;

// Convert to algebraic notation (e.g., 'e2' to 'e4')
const from = String.fromCharCode(97 + fromActualCol) + (8 - fromActualRow);
const to = String.fromCharCode(97 + toActualCol) + (8 - toActualRow);

console.log('Drop:', 'from:', from, 'to:', to);

// Trigger onMove if provided
if (onMove) {
  const result = onMove(from, to);
  if (result) {
    // Move was successful, board will be updated via position prop
  }}
    setDraggedPiece(null);
    setDraggedFrom(null);
 
};

// Classic chess board colors
const getSquareColor = (row, col) => {
  return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863'; // light/dark squares
};

// Determine style for each square
const getSquareStyle = (row, col, piece, isDragOver) => {
    const actualRow = currentPlayer === 'b' ? 7 - row : row;
    const actualCol = currentPlayer === 'b' ? 7 - col : col;
    const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
  
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);
    const baseColor = getSquareColor(row, col);
  
    let backgroundColor = baseColor;
    let border = 'none';
    let boxShadow = 'none';
  
    if (isSelected) {
      backgroundColor = '#ffec99'; // Highlight selected square
      border = '2px solid #f0c000';
    } else if (isValidMove) {
      if (piece) {
        // Enemy piece that can be captured
        border = '3px solid #ef4444'; // red border
        boxShadow = 'inset 0 0 0 3px #ef4444';
      } else {
        // Empty square that can be moved to
        backgroundColor = '#befac8'; // light green background
        border = '2px solid #22c55e'; // green border
      }
    }
  
    else if (isDragOver) {
      border = '2px solid #4ade80'; // drag-over highlight
    }
  
    return {
      width: '50px',
      height: '50px',
      backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
      fontWeight: 'bold',
      cursor: piece || isValidMove ? 'pointer' : 'default',
      userSelect: 'none',
      color: getPieceColor(piece),
      textShadow: getTextShadow(piece),
      border,
      boxShadow,
      transition: 'all 0.2s ease',
      position: 'relative',
    };
  };
  // Get the board array, flipped if playing as black
const displayBoard = currentPlayer === 'b'
? [...board].reverse().map(row => [...row].reverse())
: board;

// Get coordinate labels based on current player perspective
const files = currentPlayer === 'b'
? ["h", "g", "f", "e", "d", "c", "b", "a"]
: ["a", "b", "c", "d", "e", "f", "g", "h"];

const ranks = currentPlayer === 'b'
? [1, 2, 3, 4, 5, 6, 7, 8]
: [8, 7, 6, 5, 4, 3, 2, 1];

return (
<div
  style={{
    display: 'inline-block',
    border: '3px solid #8b4513',
    borderRadius: '5px',
    boxShadow: '5px 5px 24px rgba(0, 0, 0, 0.3)',
    padding: '8px',
    backgroundColor: '#8b4513',
  }}
> 
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '20px repeat(8, 50px) 20px',
      marginBottom: '4px',
    }}
  >
    <div></div>
    {files.map(letter => (
      <div
        key={letter}
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#f5f5dc',
        }}
      >
        {letter}
      </div>
    ))}
    <div></div>
  </div>
  <div style={{ display: 'flex' }}>
  {/* Left number column */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '20px',
      marginRight: '4px',
    }}
  >
    {ranks.map(num => (
      <div
        key={num}
        style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#f5f5dc',
        }}
      >
        {num}
      </div>
    ))}
  </div>

  <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 50px)',
      gridTemplateRows: 'repeat(8, 50px)',
      gap: '0',
      border: '2px solid #654321',
    }}
  >
    {displayBoard.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        const squareKey = `${rowIndex}-${colIndex}`;
        const isDragOver = dragOverSquare === squareKey;

        // For valid move indicator, calculate the actual square
        const actualRow = currentPlayer === 'b' ? 7 - rowIndex : rowIndex;
        const actualCol = currentPlayer === 'b' ? 7 - colIndex : colIndex;
        const actualSquare = String.fromCharCode(97 + actualCol) + (8 - actualRow);

        return (
          <div key={squareKey}
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
  {(pieces[piece] || '')}
  
  {!piece && validMoves.includes(actualSquare) && (
    <div
      style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
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
 
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '20px',
        marginLeft: '4px',
      }}
    >
      {ranks.map((num) => (
        <div
          key={num}
          style={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#f5f5dc',
          }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
  
  {/* Bottom coordinate labels - letters */}
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '20px repeat(8, 50px) 20px',
      marginTop: '4px',
    }}
  >
    <div></div>
    {files.map((letter) => (
      <div
        key={letter}
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#f5f5dc',
        }}
      >
        {letter}
      </div>
    ))}
    <div></div>
  </div>
  
  <div
    style={{
      textAlign: 'center',
      fontSize: '10px',
      color: '#f5f5dc',
      padding: '8px',
      borderRadius: '4px',
    }}
  >
    Position: {position} {currentPlayer === 'b' ? "(Black's perspective)" : "(White's perspective)"}
    </div>
    </div>
  );
}