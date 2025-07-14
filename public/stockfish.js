// Stockfish.js web worker loader
// This file will be served from the public directory

if (typeof importScripts === 'function') {
  // We're in a web worker
  try {
    // Try to load Stockfish from CDN
    importScripts('https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js');
  } catch (error) {
    console.error('Failed to load Stockfish from CDN:', error);
    
    // Fallback: Simple engine implementation
    class SimpleEngine {
      constructor() {
        this.isReady = false;
        setTimeout(() => {
          this.isReady = true;
          postMessage('readyok');
        }, 100);
      }
      
      processCommand(command) {
        if (command === 'uci') {
          postMessage('id name Simple Engine');
          postMessage('uciok');
        } else if (command === 'isready') {
          postMessage('readyok');
        } else if (command.startsWith('position')) {
          // Store position
          this.position = command;
        } else if (command.startsWith('go')) {
          // Simple move generation
          setTimeout(() => {
            // Return a random move (this is a fallback)
            const moves = ['e2e4', 'd2d4', 'g1f3', 'b1c3'];
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            postMessage(`bestmove ${randomMove}`);
          }, 500);
        }
      }
    }
    
    const engine = new SimpleEngine();
    
    onmessage = function(e) {
      engine.processCommand(e.data);
    };
  }
} else {
  // Not in a web worker, export for regular use
  console.log('Stockfish worker script loaded');
}


