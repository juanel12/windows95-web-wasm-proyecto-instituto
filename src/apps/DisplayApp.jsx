import React from 'react';
import { useWindowManager, WALLPAPERS } from '../context/WindowManagerContext';
import { playClickSound } from '../utils/win95Sound';

export default function DisplayApp({ windowId }) {
  const { wallpaper, setWallpaper, closeWindow } = useWindowManager();

  const current = WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10, padding: 6 }}>
      {/* Monitor de vista previa */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
        <div
          style={{
            width: 170,
            height: 120,
            background: '#c0c0c0',
            border: '3px outset #ffffff',
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            className={`win95-bg-${current.id}`}
            style={{
              width: '100%',
              flex: 1,
              border: '2px inset #808080',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 8,
                top: 10,
                width: 72,
                height: 46,
                background: '#c0c0c0',
                border: '1px outset #fff',
              }}
            >
              <div style={{ height: 10, background: '#000080' }} />
            </div>
          </div>
        </div>
      </div>

      <fieldset style={{ flex: 1, margin: 0 }}>
        <legend>Tapiz del Escritorio</legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {WALLPAPERS.map((wp) => (
            <div key={wp.id} className="field-row">
              <input
                id={`wp-${wp.id}`}
                type="radio"
                name="wallpaper"
                checked={wallpaper === wp.id}
                onChange={() => {
                  playClickSound();
                  setWallpaper(wp.id);
                }}
              />
              <label htmlFor={`wp-${wp.id}`} style={{ cursor: 'pointer' }}>
                {wp.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <button type="button" onClick={() => closeWindow(windowId)}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
