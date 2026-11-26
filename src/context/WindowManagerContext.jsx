import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { playClickSound } from '../utils/win95Sound';

const WindowManagerContext = createContext(null);

export const APPS_CATALOG = {
  doom: {
    id: 'doom',
    title: 'DOOM (1993) - MS-DOS Prompt',
    defaultSize: { width: 680, height: 500 },
    minSize: { width: 480, height: 380 },
  },
  notepad: {
    id: 'notepad',
    title: 'Sin título - Bloc de notas',
    defaultSize: { width: 480, height: 360 },
    minSize: { width: 320, height: 240 },
  },
  minesweeper: {
    id: 'minesweeper',
    title: 'Buscaminas',
    defaultSize: { width: 280, height: 350 },
    minSize: { width: 250, height: 320 },
  },
  mycomputer: {
    id: 'mycomputer',
    title: 'Mi PC',
    defaultSize: { width: 460, height: 340 },
    minSize: { width: 340, height: 260 },
  },
  recyclebin: {
    id: 'recyclebin',
    title: 'Papelera de reciclaje',
    defaultSize: { width: 420, height: 300 },
    minSize: { width: 300, height: 220 },
  },
  display: {
    id: 'display',
    title: 'Propiedades de Pantalla',
    defaultSize: { width: 400, height: 360 },
    minSize: { width: 360, height: 320 },
  },
  paint: {
    id: 'paint',
    title: 'Sin título - Paint',
    defaultSize: { width: 620, height: 470 },
    minSize: { width: 440, height: 340 },
  },
  calculator: {
    id: 'calculator',
    title: 'Calculadora',
    defaultSize: { width: 270, height: 290 },
    minSize: { width: 250, height: 270 },
  },
  cmd: {
    id: 'cmd',
    title: 'Símbolo del sistema MS-DOS',
    defaultSize: { width: 540, height: 360 },
    minSize: { width: 360, height: 240 },
  },
  solitaire: {
    id: 'solitaire',
    title: 'Solitario',
    defaultSize: { width: 540, height: 470 },
    minSize: { width: 490, height: 380 },
  },
  skifree: {
    id: 'skifree',
    title: 'SkiFree 95',
    defaultSize: { width: 520, height: 420 },
    minSize: { width: 380, height: 320 },
  },
  tetris: {
    id: 'tetris',
    title: 'Tetris 95',
    defaultSize: { width: 380, height: 460 },
    minSize: { width: 350, height: 440 },
  },
  breakout: {
    id: 'breakout',
    title: 'Breakout 95',
    defaultSize: { width: 520, height: 410 },
    minSize: { width: 400, height: 320 },
  },
  warcraft2: {
    id: 'warcraft2',
    title: 'WarCraft II: Tides of Darkness (1995)',
    defaultSize: { width: 700, height: 520 },
    minSize: { width: 500, height: 400 },
  },
  diablo: {
    id: 'diablo',
    title: 'Diablo (1996) - Diabloweb WASM',
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 520, height: 420 },
  },
  quake: {
    id: 'quake',
    title: 'Quake (1996) - WebAssembly',
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 520, height: 420 },
  },
  duke3d: {
    id: 'duke3d',
    title: 'Duke Nukem 3D (1996) - EDuke32 WASM',
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 520, height: 420 },
  },
};

export const WALLPAPERS = [
  { id: 'cordillera', name: 'Instituto Cordillera Retro (Quito)', type: 'cordillera', value: '#006b63' },
  { id: 'teal', name: 'Clásico Verde Azulado (#008080)', type: 'solid', value: '#008080' },
  { id: 'navy', name: 'Azul Corporativo (#004e98)', type: 'solid', value: '#004e98' },
  { id: 'clouds', name: 'Nubes Retro 95', type: 'clouds', value: '#5aa6e8' },
  { id: 'bricks', name: 'Ladrillos Clásicos', type: 'bricks', value: '#8b4513' },
  { id: 'matrix', name: 'Terminal Oscura (#0b1d13)', type: 'solid', value: '#0b1d13' },
];

export function WindowManagerProvider({ children }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [positions, setPositions] = useState({});
  const [sizes, setSizes] = useState({});
  const [wallpaper, setWallpaper] = useState('cordillera');
  const zCounterRef = useRef(100);

  const nextZIndex = useCallback(() => {
    zCounterRef.current += 1;
    return zCounterRef.current;
  }, []);

  const focusWindow = useCallback((id) => {
    const newZ = nextZIndex();
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w))
    );
    setActiveWindowId(id);
  }, [nextZIndex]);

  const openApp = useCallback((appId, payload = null) => {
    const appDef = APPS_CATALOG[appId];
    if (!appDef) return;

    playClickSound();

    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      const newZ = nextZIndex();

      if (existing) {
        setActiveWindowId(appId);
        return prev.map((w) =>
          w.id === appId
            ? {
                ...w,
                isMinimized: false,
                zIndex: newZ,
                payload: payload ?? w.payload,
                payloadSeq: payload ? (w.payloadSeq || 0) + 1 : w.payloadSeq,
              }
            : w
        );
      }

      // Calcular posición inicial en cascada dentro del viewport
      const offsetIndex = prev.length % 6;
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;

      const defaultW = Math.min(appDef.defaultSize.width, vw - 24);
      const defaultH = Math.min(appDef.defaultSize.height, vh - 56);

      const startX = Math.max(
        16,
        Math.min(80 + offsetIndex * 28, vw - defaultW - 16)
      );
      const startY = Math.max(
        16,
        Math.min(40 + offsetIndex * 24, vh - defaultH - 46)
      );

      setPositions((p) => ({ ...p, [appId]: { x: startX, y: startY } }));
      setSizes((s) => ({ ...s, [appId]: { width: defaultW, height: defaultH } }));
      setActiveWindowId(appId);

      return [
        ...prev,
        {
          id: appId,
          appId,
          title: appDef.title,
          minSize: appDef.minSize,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZ,
          payload,
          payloadSeq: payload ? 1 : 0,
        },
      ];
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((id) => {
    playClickSound();
    setOpenWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      setActiveWindowId((currActive) => {
        if (currActive !== id) return currActive;
        if (remaining.length === 0) return null;
        const top = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        return top.id;
      });
      return remaining;
    });
  }, []);

  const minimizeWindow = useCallback((id) => {
    playClickSound();
    setOpenWindows((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
      setActiveWindowId((currActive) => {
        if (currActive !== id) return currActive;
        const visible = updated.filter((w) => !w.isMinimized);
        if (visible.length === 0) return null;
        const top = visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        return top.id;
      });
      return updated;
    });
  }, []);

  const toggleMaximizeWindow = useCallback((id) => {
    playClickSound();
    const newZ = nextZIndex();
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMaximized: !w.isMaximized, isMinimized: false, zIndex: newZ }
          : w
      )
    );
    setActiveWindowId(id);
  }, [nextZIndex]);

  const toggleTaskbarWindow = useCallback((id) => {
    const win = openWindows.find((w) => w.id === id);
    if (!win) return;
    if (win.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [openWindows, activeWindowId, focusWindow, minimizeWindow]);

  const updatePosition = useCallback((id, pos) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }, []);

  const updateSize = useCallback((id, size) => {
    setSizes((prev) => ({ ...prev, [id]: size }));
  }, []);

  const updateWindowTitle = useCallback((id, newTitle) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, title: newTitle } : w))
    );
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        openWindows,
        activeWindowId,
        positions,
        sizes,
        wallpaper,
        setWallpaper,
        openApp,
        closeWindow,
        focusWindow,
        minimizeWindow,
        toggleMaximizeWindow,
        toggleTaskbarWindow,
        updatePosition,
        updateSize,
        updateWindowTitle,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider');
  return ctx;
}
