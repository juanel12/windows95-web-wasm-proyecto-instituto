import React from 'react';

export default function QuakeApp() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '2px 6px',
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        <span>
          <b>Quake (1996) WebAssembly:</b> Haz clic dentro del juego para capturar ratón y usar WASD + Clic.
        </span>
        <a
          href="https://catfoolyou.github.io/Quake-WASM/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, whiteSpace: 'nowrap' }}
        >
          Abrir en pestaña ↗
        </a>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: '#000000',
          border: '2px inset #808080',
          overflow: 'hidden',
        }}
      >
        <iframe
          src="https://catfoolyou.github.io/Quake-WASM/"
          title="Quake (1996) - WebAssembly"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen; pointer-lock"
        />
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">Quake (1996) — Quake-WASM</p>
        <p className="status-bar-field">C:\GAMES\QUAKE\QUAKE.EXE</p>
      </div>
    </div>
  );
}
