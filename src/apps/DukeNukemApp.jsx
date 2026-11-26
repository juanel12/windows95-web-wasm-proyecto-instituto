import React, { useEffect, useRef, useState } from 'react';

export default function DukeNukemApp() {
  const containerRef = useRef(null);
  const dosInstanceRef = useRef(null);
  const [status, setStatus] = useState('Iniciando DOSBox WebAssembly...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window.Dos !== 'function') {
      setError('No se encontró el motor js-dos en window.Dos.');
      return;
    }

    let cancelled = false;
    try {
      setStatus('Cargando Duke Nukem 3D (Shareware)...');
      const instance = window.Dos(el, {
        url: '/duke3d.jsdos?v=2',
        pathPrefix: '/js-dos/emulators/',
        autoStart: true,
        theme: 'dark',
        kiosk: true,
        noCloud: true,
      });
      dosInstanceRef.current = instance;

      const timer = setTimeout(() => {
        if (!cancelled) {
          setStatus('Listo — Haz clic en el juego para jugar');
          const canvas = el.querySelector('canvas');
          if (canvas) {
            canvas.setAttribute('tabindex', '0');
            canvas.focus();
          }
        }
      }, 1500);

      return () => {
        cancelled = true;
        clearTimeout(timer);
        if (dosInstanceRef.current && typeof dosInstanceRef.current.stop === 'function') {
          try {
            dosInstanceRef.current.stop();
          } catch {}
        }
        dosInstanceRef.current = null;
        if (el) el.innerHTML = '';
      };
    } catch (err) {
      setError(err?.message || 'Error al inicializar Duke Nukem 3D');
    }
  }, []);

  const focusGame = () => {
    const el = containerRef.current;
    if (!el) return;
    const canvas = el.querySelector('canvas');
    if (canvas) {
      canvas.setAttribute('tabindex', '0');
      canvas.focus();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '2px 4px',
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button type="button" onClick={focusGame} style={{ minHeight: 20, padding: '1px 8px' }}>
            Enfocar Juego
          </button>
          <span>
            <b>Controles:</b> Flechas: Mover · <b>Ctrl</b>: Disparar · <b>Espacio</b>: Abrir · <b>A/Z</b>: Saltar/Agacharse
          </span>
        </div>
        <span style={{ color: '#000080', fontWeight: 'bold', whiteSpace: 'nowrap' }}>WASM Ready</span>
      </div>

      <div
        onClick={focusGame}
        style={{
          flex: 1,
          minHeight: 0,
          background: '#000000',
          border: '2px inset #808080',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {error ? (
          <div style={{ color: '#ff5555', padding: 16, fontFamily: 'monospace' }}>{error}</div>
        ) : (
          <div ref={containerRef} tabIndex={0} style={{ width: '100%', height: '100%', outline: 'none' }} />
        )}
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">{status}</p>
        <p className="status-bar-field">C:\GAMES\DUKE3D\DUKE3D.EXE</p>
      </div>
    </div>
  );
}
