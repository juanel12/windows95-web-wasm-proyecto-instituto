import React, { useEffect, useRef, useState } from 'react';

export default function DoomApp() {
  const containerRef = useRef(null);
  const dosInstanceRef = useRef(null);
  const [status, setStatus] = useState('Iniciando DOSBox WebAssembly...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window.Dos !== 'function') {
      setError('No se encontró el motor js-dos en window.Dos. Verifica /js-dos/js-dos.js.');
      return;
    }

    let cancelled = false;
    try {
      setStatus('Cargando DOOM (1993) Shareware...');
      const instance = window.Dos(el, {
        url: '/doom.jsdos',
        pathPrefix: '/js-dos/emulators/',
        autoStart: true,
        theme: 'dark',
        kiosk: true,
        noCloud: true,
      });
      dosInstanceRef.current = instance;

      // Dar foco automático al canvas tras cargar
      const timer = setTimeout(() => {
        if (!cancelled) {
          setStatus('Listo — Haz clic en el juego para jugar');
          const canvas = el.querySelector('canvas');
          if (canvas) {
            canvas.setAttribute('tabindex', '0');
            canvas.focus();
          }
        }
      }, 1200);

      return () => {
        cancelled = true;
        clearTimeout(timer);
        if (dosInstanceRef.current && typeof dosInstanceRef.current.stop === 'function') {
          try {
            dosInstanceRef.current.stop();
          } catch {
            // Ignorar errores al detener si ya estaba detenido
          }
        }
        dosInstanceRef.current = null;
        if (el) el.innerHTML = '';
      };
    } catch (err) {
      setError(err?.message || 'Error al inicializar DOOM WebAssembly');
    }
  }, []);

  const focusGame = () => {
    const el = containerRef.current;
    if (!el) return;
    const canvas = el.querySelector('canvas');
    if (canvas) {
      canvas.setAttribute('tabindex', '0');
      canvas.focus();
    } else {
      el.focus();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: 4,
      }}
    >
      {/* Barra superior estilo MS-DOS Prompt / Win95 */}
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
          <span style={{ color: '#222' }}>
            <b>Controles:</b> Flechas/WASD: Mover · <b>Ctrl</b>: Disparar · <b>Espacio</b>: Puertas · <b>Shift</b>: Correr
          </span>
        </div>
        <span style={{ color: '#000080', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          WASM Ready
        </span>
      </div>

      {/* Contenedor del canvas js-dos */}
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
          <div style={{ color: '#ff5555', padding: 16, fontFamily: 'monospace' }}>
            <p><b>Error de ejecución MS-DOS:</b></p>
            <p>{error}</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            tabIndex={0}
            style={{ width: '100%', height: '100%', outline: 'none' }}
          />
        )}
      </div>

      {/* Barra de estado inferior */}
      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">{status}</p>
        <p className="status-bar-field">C:\GAMES\DOOM\DOOM.EXE</p>
        <p className="status-bar-field">F11: Pantalla Completa</p>
      </div>
    </div>
  );
}
