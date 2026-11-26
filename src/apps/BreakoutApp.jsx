import React, { useEffect, useRef, useState, useCallback } from 'react';
import { playClickSound, playErrorSound, playVictorySound } from '../utils/win95Sound';

const HIGH_KEY = 'win95_breakout_high';
const ROW_COLORS = ['#ff2244', '#ff7700', '#ffcc00', '#00cc44', '#00aaff'];

export default function BreakoutApp() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState('playing'); // playing | lost | won
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGH_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const buildBricks = (lvl) => {
    const rows = Math.min(6, 4 + lvl);
    const cols = 8;
    const bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: 18 + c * 56,
          y: 34 + r * 20,
          w: 50,
          h: 14,
          color: ROW_COLORS[r % ROW_COLORS.length],
          alive: true,
        });
      }
    }
    return bricks;
  };

  const initGame = useCallback((lvl = 1, keepScore = 0, keepLives = 3) => {
    const speedMult = 1 + (lvl - 1) * 0.14;
    stateRef.current = {
      paddleX: 200,
      paddleW: 84,
      ballX: 240,
      ballY: 260,
      dx: 3.0 * speedMult * (Math.random() < 0.5 ? 1 : -1),
      dy: -3.2 * speedMult,
      bricks: buildBricks(lvl),
      score: keepScore,
      lives: keepLives,
      level: lvl,
      keys: {},
      active: true,
    };
    setScore(keepScore);
    setLives(keepLives);
    setLevel(lvl);
    setStatus('playing');
  }, []);

  useEffect(() => {
    initGame(1, 0, 3);
  }, [initGame]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (stateRef.current) stateRef.current.keys[e.key] = true;
    };
    const onKeyUp = (e) => {
      if (stateRef.current) stateRef.current.keys[e.key] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    let rafId = null;

    const loop = () => {
      const canvas = canvasRef.current;
      const s = stateRef.current;

      if (canvas && s) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        if (s.active) {
          if (s.keys['ArrowLeft'] || s.keys['a'] || s.keys['A']) {
            s.paddleX = Math.max(4, s.paddleX - 6);
          }
          if (s.keys['ArrowRight'] || s.keys['d'] || s.keys['D']) {
            s.paddleX = Math.min(W - s.paddleW - 4, s.paddleX + 6);
          }

          s.ballX += s.dx;
          s.ballY += s.dy;

          if (s.ballX < 6 || s.ballX > W - 6) s.dx *= -1;
          if (s.ballY < 6) s.dy *= -1;

          // Rebote en paleta
          const paddleY = H - 22;
          if (
            s.dy > 0 &&
            s.ballY >= paddleY - 6 &&
            s.ballY <= paddleY + 8 &&
            s.ballX >= s.paddleX &&
            s.ballX <= s.paddleX + s.paddleW
          ) {
            const hitOffset = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2);
            s.dx = hitOffset * 4.4;
            s.dy = -Math.abs(s.dy);
            playClickSound();
          }

          // Colisión con ladrillos
          for (const b of s.bricks) {
            if (!b.alive) continue;
            if (
              s.ballX > b.x - 4 &&
              s.ballX < b.x + b.w + 4 &&
              s.ballY > b.y - 4 &&
              s.ballY < b.y + b.h + 4
            ) {
              b.alive = false;
              s.dy *= -1;
              s.score += 10 * s.level;
              setScore(s.score);
              playClickSound();
              setHighScore((prev) => {
                const best = Math.max(prev, s.score);
                try {
                  localStorage.setItem(HIGH_KEY, String(best));
                } catch {}
                return best;
              });
              break;
            }
          }

          // Nivel completado
          if (s.bricks.every((b) => !b.alive)) {
            playVictorySound();
            initGame(s.level + 1, s.score + 100, s.lives);
          }

          // Bola perdida
          if (s.ballY > H + 10) {
            s.lives -= 1;
            setLives(s.lives);
            playErrorSound();
            if (s.lives <= 0) {
              s.active = false;
              setStatus('lost');
            } else {
              s.ballX = s.paddleX + s.paddleW / 2;
              s.ballY = H - 40;
              s.dy = -Math.abs(s.dy);
            }
          }
        }

        // Fondo retro
        ctx.fillStyle = '#070720';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(22, 185, 106, 0.14)';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ITS CORDILLERA • QUITO', W / 2, H / 2 + 25);

        // Ladrillos
        for (const b of s.bricks) {
          if (!b.alive) continue;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }

        // Paleta
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(s.paddleX, H - 22, s.paddleW, 10);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(s.paddleX, H - 22, s.paddleW, 10);

        // Bola
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [initGame]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.active) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    s.paddleX = Math.max(4, Math.min(canvas.width - s.paddleW - 4, x - s.paddleW / 2));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 6px',
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={() => initGame(1, 0, 3)}>Reiniciar</button>
          <span>Mueve con <b>Ratón</b> o <b>← →</b></span>
        </div>
        <div style={{ fontWeight: 'bold' }}>
          Puntos: {score} | Nivel: {level} | Vidas: {'❤️'.repeat(Math.max(0, lives))} | Récord: {highScore}
        </div>
      </div>

      <div
        className="sunken-panel"
        style={{
          flex: 1,
          position: 'relative',
          background: '#070720',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={330}
          onMouseMove={handleMouseMove}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'none' }}
        />

        {status === 'lost' && (
          <div
            className="window"
            style={{ position: 'absolute', padding: 14, textAlign: 'center', zIndex: 10 }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>💥 GAME OVER</div>
            <div style={{ fontSize: 12, marginBottom: 10 }}>
              Puntuación final: <b>{score}</b>
            </div>
            <button type="button" onClick={() => initGame(1, 0, 3)}>Jugar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  );
}
