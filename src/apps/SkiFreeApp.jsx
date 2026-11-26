import React, { useEffect, useRef, useState, useCallback } from 'react';
import { playErrorSound, playVictorySound } from '../utils/win95Sound';

const HIGH_SCORE_KEY = 'win95_skifree_highscore';

export default function SkiFreeApp() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const [status, setStatus] = useState('playing'); // playing | crashed | eaten

  const initGame = useCallback(() => {
    const obstacles = [];
    for (let i = 0; i < 26; i++) {
      obstacles.push({
        x: Math.random() * 440 + 20,
        y: Math.random() * 480 + 180,
        type: Math.random() < 0.14 ? 'ramp' : Math.random() < 0.72 ? 'tree' : 'rock',
      });
    }

    stateRef.current = {
      playerX: 240,
      playerY: 110,
      dir: 0, // -1 izq, 0 centro, 1 der
      speed: 3.4,
      jumpTimer: 0,
      distance: 0,
      obstacles,
      yeti: { active: false, x: 240, y: -60 },
      keys: {},
      alive: true,
    };
    setDistance(0);
    setStatus('playing');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!stateRef.current) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        stateRef.current.keys[e.key] = true;
        if (e.key === ' ' && stateRef.current.jumpTimer === 0 && stateRef.current.alive) {
          stateRef.current.jumpTimer = 28;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (stateRef.current) {
        stateRef.current.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animId = null;

    const loop = () => {
      const canvas = canvasRef.current;
      const s = stateRef.current;
      if (canvas && s) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        if (s.alive) {
          if (s.keys['ArrowLeft'] || s.keys['a'] || s.keys['A']) {
            s.dir = -1;
            s.playerX = Math.max(16, s.playerX - 3.6);
          } else if (s.keys['ArrowRight'] || s.keys['d'] || s.keys['D']) {
            s.dir = 1;
            s.playerX = Math.min(W - 16, s.playerX + 3.6);
          } else {
            s.dir = 0;
          }

          const boost = s.keys['ArrowDown'] ? 1.8 : 0;
          const curSpeed = s.speed + boost + Math.min(2.5, s.distance / 1500);

          if (s.jumpTimer > 0) s.jumpTimer--;

          s.distance += curSpeed * 0.25;
          const meters = Math.floor(s.distance);
          setDistance(meters);

          // Mover obstáculos hacia arriba
          for (const obs of s.obstacles) {
            obs.y -= curSpeed;
            if (obs.y < -30) {
              obs.y = H + Math.random() * 120;
              obs.x = Math.random() * (W - 32) + 16;
              obs.type = Math.random() < 0.14 ? 'ramp' : Math.random() < 0.72 ? 'tree' : 'rock';
            }

            // Colisión si no está saltando
            const dx = Math.abs(obs.x - s.playerX);
            const dy = Math.abs(obs.y - s.playerY);
            if (dx < 14 && dy < 14) {
              if (obs.type === 'ramp') {
                s.jumpTimer = 34;
                playVictorySound();
              } else if (s.jumpTimer === 0) {
                s.alive = false;
                setStatus('crashed');
                playErrorSound();
                const best = Math.max(highScore, meters);
                setHighScore(best);
                try {
                  localStorage.setItem(HIGH_SCORE_KEY, String(best));
                } catch {}
              }
            }
          }

          // Activar al Yeti después de 450m
          if (meters >= 450 && !s.yeti.active) {
            s.yeti.active = true;
            s.yeti.x = s.playerX;
            s.yeti.y = -40;
          }
          if (s.yeti.active) {
            const dx = s.playerX - s.yeti.x;
            const dy = s.playerY - s.yeti.y;
            const dist = Math.hypot(dx, dy) || 1;
            const yetiSpeed = s.keys['ArrowDown'] ? 4.4 : 4.1;
            s.yeti.x += (dx / dist) * yetiSpeed;
            s.yeti.y += (dy / dist) * yetiSpeed;

            if (dist < 16 && s.jumpTimer === 0) {
              s.alive = false;
              setStatus('eaten');
              playErrorSound();
              const best = Math.max(highScore, meters);
              setHighScore(best);
              try {
                localStorage.setItem(HIGH_SCORE_KEY, String(best));
              } catch {}
            }
          }
        }

        // Dibujar nieve
        ctx.fillStyle = '#f4f8ff';
        ctx.fillRect(0, 0, W, H);

        // Huellas de esquí
        ctx.strokeStyle = '#d0e0f5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.playerX - 4, 0);
        ctx.lineTo(s.playerX - 4, s.playerY);
        ctx.moveTo(s.playerX + 4, 0);
        ctx.lineTo(s.playerX + 4, s.playerY);
        ctx.stroke();

        // Dibujar obstáculos
        for (const obs of s.obstacles) {
          if (obs.type === 'tree') {
            ctx.fillStyle = '#006600';
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y - 16);
            ctx.lineTo(obs.x - 11, obs.y + 6);
            ctx.lineTo(obs.x + 11, obs.y + 6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#663300';
            ctx.fillRect(obs.x - 2, obs.y + 6, 4, 5);
          } else if (obs.type === 'rock') {
            ctx.fillStyle = '#777777';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#aaaaaa';
            ctx.fillRect(obs.x - 4, obs.y - 4, 4, 3);
          } else {
            // Rampa arcoíris
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(obs.x - 12, obs.y - 3, 24, 6);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(obs.x - 10, obs.y - 2, 20, 3);
          }
        }

        // Dibujar esquiador
        const jumpOffset = s.jumpTimer > 0 ? Math.sin((s.jumpTimer / 34) * Math.PI) * 16 : 0;
        if (s.jumpTimer > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.beginPath();
          ctx.ellipse(s.playerX, s.playerY + 10, 8, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        const py = s.playerY - jumpOffset;
        ctx.fillStyle = s.alive ? '#ff0000' : '#880000';
        ctx.fillRect(s.playerX - 4, py - 10, 8, 6); // cabeza/gorro
        ctx.fillStyle = '#0000cc';
        ctx.fillRect(s.playerX - 5, py - 4, 10, 8); // chaqueta
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.playerX - 5 + s.dir * 3, py + 4);
        ctx.lineTo(s.playerX - 5 + s.dir * 5, py + 11);
        ctx.moveTo(s.playerX + 5 + s.dir * 3, py + 4);
        ctx.lineTo(s.playerX + 5 + s.dir * 5, py + 11);
        ctx.stroke();

        // Dibujar Yeti
        if (s.yeti.active) {
          const yx = s.yeti.x;
          const yy = s.yeti.y;
          ctx.fillStyle = '#cccccc';
          ctx.fillRect(yx - 10, yy - 16, 20, 26);
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(yx - 5, yy - 12, 3, 3);
          ctx.fillRect(yx + 2, yy - 12, 3, 3);
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

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
          <button type="button" onClick={initGame}>Reiniciar (F2)</button>
          <span><b>Controles:</b> ← → Mover · ↓ Acelerar · <b>Espacio</b>: Saltar</span>
        </div>
        <span style={{ fontWeight: 'bold' }}>
          {distance}m | Récord: {highScore}m
        </span>
      </div>

      <div
        className="sunken-panel"
        style={{
          flex: 1,
          position: 'relative',
          background: '#f4f8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {status !== 'playing' && (
          <div
            className="window"
            style={{
              position: 'absolute',
              padding: 14,
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>
              {status === 'eaten'
                ? '🐾 ¡El Yeti de SkiFree te atrapó!'
                : '🌲 ¡Chocaste contra un obstáculo!'}
            </div>
            <div style={{ fontSize: 12, marginBottom: 10 }}>
              Distancia recorrida: <b>{distance} m</b>
            </div>
            <button type="button" onClick={initGame}>Esquiar de nuevo</button>
          </div>
        )}
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">SkiFree 95 — Edición Cordillera Quito</p>
        <p className="status-bar-field">¡Cuidado con el Yeti a los 450m!</p>
      </div>
    </div>
  );
}
