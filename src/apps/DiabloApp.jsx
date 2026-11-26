import React from 'react';

export default function DiabloApp() {
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
          <b>Diabloweb (WebAssembly):</b> Haz clic en <i>Play Shareware</i> para jugar gratis (o suelta tu <code>DIABDAT.MPQ</code>).
        </span>
        <a
          href="https://d07riv.github.io/diabloweb/"
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
          src="https://d07riv.github.io/diabloweb/"
          title="Diablo (1996) - Diabloweb WebAssembly"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen"
        />
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">Diablo (1996) — Diabloweb WASM</p>
        <p className="status-bar-field">C:\GAMES\DIABLO\DIABLO.EXE</p>
      </div>
    </div>
  );
}
