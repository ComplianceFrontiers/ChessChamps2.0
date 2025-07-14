// Stockfish chess engine utility
import { Chess } from 'chess.js';

class StockfishEngine {
  constructor() {
    this.engine = null;
    this.isReady = false;
    this.currentPosition = '';
    this.analysisCallback = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Use web worker for Stockfish
        if (typeof Worker !== 'undefined') {
          // Create Stockfish worker
          const stockfishWorker = new Worker('/stockfish.js');
          this.engine = stockfishWorker;

          this.engine.onmessage = (event) => {
            const message = event.data;
            this.handleEngineMessage(message);
          };

          this.engine.onerror = (error) => {
            console.error('Stockfish worker error:', error);
            reject(error);
          };

          // Initialize engine
          this.sendCommand('uci');
          
          // Set up ready check
          setTimeout(() => {
            if (this.isReady) {
              resolve();
            } else {
              // Fallback to simple engine if Stockfish fails
              console.warn('Stockfish not ready, using fallback');
              this.engine = null;
              resolve();
            }
          }, 3000);
        } else {
          // No web worker support, use fallback
          console.warn('Web Workers not supported, using fallback engine');
          resolve();
        }
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
        resolve(); // Don't reject, just use fallback
      }
    });

    return this.initPromise;
  }

  handleEngineMessage(message) {
    console.log('Stockfish message:', message);
    
    if (message.includes('uciok')) {
      this.sendCommand('isready');
    } else if (message.includes('readyok')) {
      this.isReady = true;
      console.log('Stockfish is ready!');
    } else if (message.includes('bestmove')) {
      const parts = message.split(' ');
      const bestMove = parts[1];
      if (this.analysisCallback && bestMove !== '(none)') {
        this.analysisCallback(bestMove);
      }
    }
  }

  sendCommand(command) {
    if (this.engine) {
      console.log('Sending to Stockfish:', command);
      this.engine.postMessage(command);
    }
  }

  async getBestMove(fen, depth = 15) {
    await this.init();
    
    if (!this.engine || !this.isReady) {
      // Fallback to simple evaluation
      return this.getSimpleBestMove(fen);
    }

    return new Promise((resolve, reject) => {
      let resolved = false;
      this.analysisCallback = (bestMove) => {
        if (resolved) return;
        resolved = true;
        // Convert UCI move to SAN notation
        this.convertUciToSan(fen, bestMove).then(resolve).catch(() => {
          resolve(bestMove); // Return UCI if conversion fails
        });
      };

      // Set position
      this.sendCommand(`position fen ${fen}`);
      // Start analysis
      this.sendCommand(`go depth ${depth}`);
      // Timeout fallback (wait longer for accuracy)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.getSimpleBestMove(fen).then(resolve).catch(reject);
        }
      }, 10000); // 10 seconds max
    });
  }

  async convertUciToSan(fen, uciMove) {
    try {
      const tempGame = new Chess();
      tempGame.load(fen);
      
      // Parse UCI move (e.g., "e2e4" or "e7e8q")
      if (!uciMove || uciMove.length < 4) {
        return uciMove;
      }
      
      const from = uciMove.substring(0, 2);
      const to = uciMove.substring(2, 4);
      const promotion = uciMove.length > 4 ? uciMove.substring(4) : undefined;
      
      console.log('Converting UCI:', uciMove, 'from:', from, 'to:', to, 'promotion:', promotion);
      
      // Try different move formats
      let moveResult = null;
      
      // Try 1: SAN notation directly (maybe it's already SAN)
      try {
        moveResult = tempGame.move(uciMove);
        if (moveResult) {
          console.log('Move was already in SAN format:', uciMove);
          return uciMove;
        }
      } catch (e) {
        // Continue to other formats
      }
      
      // Try 2: Object format with promotion
      try {
        const moveObj = { from, to };
        if (promotion) {
          moveObj.promotion = promotion;
        }
        console.log('Trying move object:', moveObj);
        moveResult = tempGame.move(moveObj);
      } catch (e) {
        console.log('Object format failed:', e.message);
      }
      
      // Try 3: String format (from + to)
      if (!moveResult) {
        try {
          const moveString = from + to + (promotion || '');
          console.log('Trying string format:', moveString);
          moveResult = tempGame.move(moveString);
        } catch (e) {
          console.log('String format failed:', e.message);
        }
      }
      
      // Try 4: All possible legal moves to find match
      if (!moveResult) {
        try {
          const legalMoves = tempGame.moves({ verbose: true });
          console.log('Legal moves available:', legalMoves.map(m => `${m.from}-${m.to} (${m.san})`));
          
          // Find matching move by from/to squares
          const matchingMove = legalMoves.find(move => 
            move.from === from && move.to === to
          );
          
          if (matchingMove) {
            console.log('Found matching legal move:', matchingMove.san);
            return matchingMove.san;
          }
        } catch (e) {
          console.log('Legal moves check failed:', e.message);
        }
      }
      
      if (moveResult) {
        console.log('UCI to SAN conversion successful:', uciMove, '->', moveResult.san);
        return moveResult.san;
      } else {
        console.warn('Failed to convert UCI to SAN:', uciMove);
        // Return a simple fallback - just the UCI move
        return uciMove;
      }
    } catch (error) {
      console.error('Error converting UCI to SAN:', error, 'for move:', uciMove);
      return uciMove; // Return original UCI if conversion fails
    }
  }

  // Fallback simple evaluation (your existing logic)
  async getSimpleBestMove(fen) {
    try {
      const { Chess } = await import('chess.js');
      const tempGame = new Chess();
      tempGame.load(fen);
      
      const moves = tempGame.moves({ verbose: true });
      if (moves.length === 0) {
        throw new Error('No legal moves available');
      }
      
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
        
        // Prioritize center control
        const centerSquares = ['e4', 'e5', 'd4', 'd5'];
        if (centerSquares.includes(move.to)) {
          score += 5;
        }
        
        // Prioritize piece development
        if (move.from[1] === '1' || move.from[1] === '8') {
          score += 3;
        }
        
        score += Math.random() * 0.1;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      return bestMove.san;
    } catch (error) {
      console.error('Simple evaluation error:', error);
      throw error;
    }
  }

  destroy() {
    if (this.engine) {
      this.engine.terminate();
      this.engine = null;
    }
    this.isReady = false;
  }
}

// Singleton instance
let stockfishInstance = null;

export const getStockfishEngine = () => {
  if (!stockfishInstance) {
    stockfishInstance = new StockfishEngine();
  }
  return stockfishInstance;
};

export default StockfishEngine;