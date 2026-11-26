import React, { useState, useEffect, useCallback } from 'react';
import { playClickSound, playErrorSound, playVictorySound } from '../utils/win95Sound';
import { CordilleraSymbolIcon } from '../components/Win95Icons';

const DIFFICULTIES = {
  beginner: { label: 'Principiante (9x9)', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermedio (12x12)', rows: 12, cols: 12, mines: 22 },
};

const NUMBER_COLORS = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacent: 0,
      exploded: false,
    }))
  );
}

function placeMines(board, rows, cols, totalMines, safeR, safeC) {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < totalMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if ((r === safeR && c === safeC) || next[r][c].isMine) continue;
    next[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].isMine) {
            count++;
          }
        }
      }
      next[r][c].adjacent = count;
    }
  }
  return next;
}

function formatLed(num) {
  const clamped = Math.max(-99, Math.min(999, num));
  if (clamped < 0) return `-${String(Math.abs(clamped)).padStart(2, '0')}`;
  return String(clamped).padStart(3, '0');
}

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState('beginner');
  const config = DIFFICULTIES[difficulty];

  const [board, setBoard] = useState(() => createEmptyBoard(config.rows, config.cols));
  const [minesPlaced, setMinesPlaced] = useState(false);
  const [gameState, setGameState] = useState('ready'); // ready | playing | won | lost
  const [seconds, setSeconds] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  const resetGame = useCallback(
    (diffKey = difficulty) => {
      const cfg = DIFFICULTIES[diffKey];
      setBoard(createEmptyBoard(cfg.rows, cfg.cols));
      setMinesPlaced(false);
      setGameState('ready');
      setSeconds(0);
    },
    [difficulty]
  );

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setSeconds((s) => Math.min(999, s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleDifficultyChange = (e) => {
    const nextDiff = e.target.value;
    setDifficulty(nextDiff);
    resetGame(nextDiff);
  };

  const revealCell = (r, c) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    let currentBoard = board;
    if (!minesPlaced) {
      currentBoard = placeMines(board, config.rows, config.cols, config.mines, r, c);
      setMinesPlaced(true);
      setGameState('playing');
    }

    const next = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

    if (next[r][c].isMine) {
      next[r][c].exploded = true;
      for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
          if (next[i][j].isMine) next[i][j].isRevealed = true;
        }
      }
      setBoard(next);
      setGameState('lost');
      playErrorSound();
      return;
    }

    // Flood fill BFS
    const queue = [[r, c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      const cell = next[cr][cc];
      if (cell.isRevealed || cell.isFlagged) continue;
      cell.isRevealed = true;

      if (cell.adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (
              nr >= 0 &&
              nr < config.rows &&
              nc >= 0 &&
              nc < config.cols &&
              !next[nr][nc].isRevealed &&
              !next[nr][nc].isMine
            ) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    // Check victory
    let unrevealedSafe = 0;
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.cols; j++) {
        if (!next[i][j].isMine && !next[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
          if (next[i][j].isMine) next[i][j].isFlagged = true;
        }
      }
      setGameState('won');
      playVictorySound();
    } else {
      playClickSound();
    }

    setBoard(next);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[r][c].isRevealed) return;

    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    next[r][c].isFlagged = !next[r][c].isFlagged;
    setBoard(next);
    playClickSound();
  };

  const flagsCount = board.flat().filter((c) => c.isFlagged).length;
  const remainingMines = config.mines - flagsCount;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        padding: 4,
        gap: 6,
        background: '#c0c0c0',
        overflow: 'auto',
      }}
    >
      {/* Banner temático Cordillera */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          width: '100%',
          padding: '2px 6px',
          background: '#005b54',
          color: '#ffffff',
          fontSize: 10,
          fontWeight: 'bold',
          letterSpacing: 0.4,
          boxSizing: 'border-box',
        }}
      >
        <CordilleraSymbolIcon size={14} color="#33ff99" />
        <span>BUSCAMINAS • CORDILLERA QUITO</span>
      </div>

      {/* Selector de dificultad */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 6 }}>
        <select value={difficulty} onChange={handleDifficultyChange} style={{ fontSize: 11 }}>
          {Object.entries(DIFFICULTIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 10, color: '#444' }}>Clic der: 🚩</span>
      </div>

      {/* Marco principal estilo Buscaminas 95 */}
      <div
        style={{
          background: '#c0c0c0',
          borderTop: '3px solid #ffffff',
          borderLeft: '3px solid #ffffff',
          borderRight: '3px solid #808080',
          borderBottom: '3px solid #808080',
          padding: 6,
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Marcador superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 6px',
            borderTop: '2px solid #808080',
            borderLeft: '2px solid #808080',
            borderRight: '2px solid #ffffff',
            borderBottom: '2px solid #ffffff',
          }}
        >
          <div className="win95-led">{formatLed(remainingMines)}</div>
          <button
            type="button"
            onClick={() => resetGame()}
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Reiniciar juego"
          >
            <CordilleraSymbolIcon
              size={18}
              color={
                gameState === 'lost'
                  ? '#cc0000'
                  : gameState === 'won'
                  ? '#00aa44'
                  : isPressing
                  ? '#000080'
                  : '#008844'
              }
            />
          </button>
          <div className="win95-led">{formatLed(seconds)}</div>
        </div>

        {/* Cuadrícula de celdas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${config.cols}, 22px)`,
            gridTemplateRows: `repeat(${config.rows}, 22px)`,
            borderTop: '3px solid #808080',
            borderLeft: '3px solid #808080',
            borderRight: '3px solid #ffffff',
            borderBottom: '3px solid #ffffff',
          }}
          onMouseLeave={() => setIsPressing(false)}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const revealedStyle = {
                width: 22,
                height: 22,
                boxSizing: 'border-box',
                background: cell.exploded ? '#ff0000' : '#c0c0c0',
                border: '1px solid #808080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 13,
                fontFamily: '"Courier New", monospace',
                color: cell.adjacent ? NUMBER_COLORS[cell.adjacent] : '#000',
                userSelect: 'none',
              };

              if (cell.isRevealed) {
                return (
                  <div key={`${r}-${c}`} style={revealedStyle}>
                    {cell.isMine ? '💣' : cell.adjacent > 0 ? cell.adjacent : ''}
                  </div>
                );
              }

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onMouseDown={(e) => {
                    if (e.button === 0) setIsPressing(true);
                  }}
                  onMouseUp={() => setIsPressing(false)}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    width: 22,
                    height: 22,
                    minWidth: 22,
                    minHeight: 22,
                    padding: 0,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                  }}
                >
                  {cell.isFlagged ? <CordilleraSymbolIcon size={14} color="#008844" /> : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {gameState === 'won' && (
        <div style={{ color: '#006600', fontWeight: 'bold', fontSize: 12 }}>
          ¡Victoria Cordillera! Tiempo: {seconds}s
        </div>
      )}
      {gameState === 'lost' && (
        <div style={{ color: '#aa0000', fontWeight: 'bold', fontSize: 12 }}>
          ¡BOOM! Haz clic en 😵 para reintentar
        </div>
      )}
    </div>
  );
}
