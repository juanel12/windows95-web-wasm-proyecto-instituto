import React, { useEffect, useRef, useState, useCallback } from 'react';
import { playClickSound, playErrorSound, playVictorySound } from '../utils/win95Sound';

const COLS = 10;
const ROWS = 20;
const BLOCK = 20;
const HIGH_KEY = 'win95_tetris_high';

const SHAPES = [
  { shape: [[1, 1, 1, 1]], color: '#00ffff' }, // I
  { shape: [[1, 1], [1, 1]], color: '#ffff00' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#aa00ff' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#0055ff' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff8800' }, // L
];

function randomPiece() {
  const p = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    matrix: p.shape.map((r) => [...r]),
    color: p.color,
    x: Math.floor(COLS / 2) - Math.ceil(p.shape[0].length / 2),
    y: 0,
  };
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}

export default function TetrisApp() {
  const canvasRef = useRef(null);
  const nextCanvasRef = useRef(null);
  const stateRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGH_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const initGame = useCallback(() => {
    stateRef.current = {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      current: randomPiece(),
      next: randomPiece(),
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false,
      lastDrop: performance.now(),
    };
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const collides = (board, piece, dx = 0, dy = 0, mat = piece.matrix) => {
    for (let r = 0; r < mat.length; r++) {
      for (let c = 0; c < mat[r].length; c++) {
        if (!mat[r][c]) continue;
        const nx = piece.x + c + dx;
        const ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  };

  const lockAndClear = useCallback((s) => {
    const { board, current } = s;
    for (let r = 0; r < current.matrix.length; r++) {
      for (let c = 0; c < current.matrix[r].length; c++) {
        if (!current.matrix[r][c]) continue;
        const ny = current.y + r;
        const nx = current.x + c;
        if (ny < 0) {
          s.gameOver = true;
          setGameOver(true);
          playErrorSound();
          return;
        }
        board[ny][nx] = current.color;
      }
    }

    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell !== null)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][cleared] * s.level;
      s.score += pts;
      s.lines += cleared;
      s.level = Math.floor(s.lines / 10) + 1;
      setScore(s.score);
      setLines(s.lines);
      setLevel(s.level);
      playVictorySound();

      setHighScore((prevHigh) => {
        const best = Math.max(prevHigh, s.score);
        try {
          localStorage.setItem(HIGH_KEY, String(best));
        } catch {}
        return best;
      });
    } else {
      playClickSound();
    }

    s.current = s.next;
    s.next = randomPiece();

    if (collides(s.board, s.current, 0, 0)) {
      s.gameOver = true;
      setGameOver(true);
      playErrorSound();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const s = stateRef.current;
      if (!s || s.gameOver) return;

      if (e.key === 'p' || e.key === 'P') {
        s.paused = !s.paused;
        setPaused(s.paused);
        return;
      }
      if (s.paused) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!collides(s.board, s.current, -1, 0)) s.current.x--;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!collides(s.board, s.current, 1, 0)) s.current.x++;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!collides(s.board, s.current, 0, 1)) {
          s.current.y++;
          s.score += 1;
          setScore(s.score);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const rotated = rotateMatrix(s.current.matrix);
        if (!collides(s.board, s.current, 0, 0, rotated)) {
          s.current.matrix = rotated;
        } else if (!collides(s.board, s.current, -1, 0, rotated)) {
          s.current.x--;
          s.current.matrix = rotated;
        } else if (!collides(s.board, s.current, 1, 0, rotated)) {
          s.current.x++;
          s.current.matrix = rotated;
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        while (!collides(s.board, s.current, 0, 1)) {
          s.current.y++;
          s.score += 2;
        }
        setScore(s.score);
        lockAndClear(s);
        s.lastDrop = performance.now();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockAndClear]);

  useEffect(() => {
    let rafId = null;

    const drawBlock = (ctx, x, y, color, size = BLOCK) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * size, y * size, size, size);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x * size + 1, y * size + size - 1);
      ctx.lineTo(x * size + 1, y * size + 1);
      ctx.lineTo(x * size + size - 1, y * size + 1);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.moveTo(x * size + size - 1, y * size + 1);
      ctx.lineTo(x * size + size - 1, y * size + size - 1);
      ctx.lineTo(x * size + 1, y * size + size - 1);
      ctx.stroke();
    };

    const loop = (now) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      const nextCanvas = nextCanvasRef.current;

      if (s && canvas) {
        const dropInterval = Math.max(100, 650 - (s.level - 1) * 55);
        if (!s.gameOver && !s.paused && now - s.lastDrop >= dropInterval) {
          if (!collides(s.board, s.current, 0, 1)) {
            s.current.y++;
          } else {
            lockAndClear(s);
          }
          s.lastDrop = now;
        }

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#080814';
        ctx.fillRect(0, 0, COLS * BLOCK, ROWS * BLOCK);

        // Cuadrícula sutil
        ctx.strokeStyle = '#18182c';
        ctx.lineWidth = 1;
        for (let r = 0; r <= ROWS; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * BLOCK);
          ctx.lineTo(COLS * BLOCK, r * BLOCK);
          ctx.stroke();
        }
        for (let c = 0; c <= COLS; c++) {
          ctx.beginPath();
          ctx.moveTo(c * BLOCK, 0);
          ctx.lineTo(c * BLOCK, ROWS * BLOCK);
          ctx.stroke();
        }

        // Bloques fijos
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (s.board[r][c]) drawBlock(ctx, c, r, s.board[r][c]);
          }
        }

        // Pieza actual
        if (!s.gameOver) {
          for (let r = 0; r < s.current.matrix.length; r++) {
            for (let c = 0; c < s.current.matrix[r].length; c++) {
              if (s.current.matrix[r][c]) {
                drawBlock(ctx, s.current.x + c, s.current.y + r, s.current.color);
              }
            }
          }
        }

        // Siguiente pieza
        if (nextCanvas) {
          const nctx = nextCanvas.getContext('2d');
          nctx.fillStyle = '#080814';
          nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
          const nm = s.next.matrix;
          const offX = (4 - nm[0].length) / 2;
          const offY = (4 - nm.length) / 2;
          for (let r = 0; r < nm.length; r++) {
            for (let c = 0; c < nm[r].length; c++) {
              if (nm[r][c]) drawBlock(nctx, offX + c, offY + r, s.next.color, 18);
            }
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [lockAndClear]);

  return (
    <div style={{ display: 'flex', height: '100%', gap: 10, padding: 8, background: '#c0c0c0' }}>
      {/* Tablero principal */}
      <div
        className="sunken-panel"
        style={{
          position: 'relative',
          background: '#080814',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <canvas ref={canvasRef} width={COLS * BLOCK} height={ROWS * BLOCK} />
        {(gameOver || paused) && (
          <div
            className="window"
            style={{
              position: 'absolute',
              padding: 12,
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
              {gameOver ? 'GAME OVER' : 'PAUSA'}
            </div>
            {gameOver ? (
              <button type="button" onClick={initGame}>Jugar de nuevo</button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (stateRef.current) {
                    stateRef.current.paused = false;
                    setPaused(false);
                  }
                }}
              >
                Reanudar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Panel lateral derecho */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <fieldset style={{ margin: 0 }}>
          <legend>Siguiente</legend>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <canvas ref={nextCanvasRef} width={72} height={72} style={{ border: '1px inset #808080' }} />
          </div>
        </fieldset>

        <fieldset style={{ margin: 0 }}>
          <legend>Estadísticas</legend>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>Puntos: <b>{score}</b></div>
            <div>Líneas: <b>{lines}</b></div>
            <div>Nivel: <b>{level}</b></div>
            <div>Récord: <b>{highScore}</b></div>
          </div>
        </fieldset>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button type="button" onClick={initGame}>Nuevo Juego</button>
          <button
            type="button"
            onClick={() => {
              if (!stateRef.current || stateRef.current.gameOver) return;
              stateRef.current.paused = !stateRef.current.paused;
              setPaused(stateRef.current.paused);
            }}
          >
            {paused ? 'Reanudar (P)' : 'Pausa (P)'}
          </button>
        </div>

        <div style={{ fontSize: 10, color: '#333', lineHeight: 1.4, marginTop: 'auto' }}>
          <b>Controles:</b><br />
          ← → : Mover<br />
          ↑ : Rotar<br />
          ↓ : Bajar rápido<br />
          Espacio : Soltar<br />
          P : Pausa
        </div>
      </div>
    </div>
  );
}
