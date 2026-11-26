import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import {
  WindowsFlagIcon,
  SpeakerIcon,
  DoomIcon,
  NotepadIcon,
  MinesweeperIcon,
  MyComputerIcon,
  RecycleBinIcon,
  DisplayIcon,
  PaintIcon,
  CalculatorIcon,
  MsDosIcon,
  SolitaireIcon,
  SkiFreeIcon,
  TetrisIcon,
  BreakoutIcon,
  Warcraft2Icon,
  DiabloIcon,
  QuakeIcon,
  DukeNukemIcon,
} from './Win95Icons';
import { getSoundMuted, setSoundMuted, playClickSound } from '../utils/win95Sound';
import StartMenu from './StartMenu';

function getSmallIcon(appId) {
  switch (appId) {
    case 'doom':
      return <DoomIcon size={14} />;
    case 'warcraft2':
      return <Warcraft2Icon size={14} />;
    case 'diablo':
      return <DiabloIcon size={14} />;
    case 'quake':
      return <QuakeIcon size={14} />;
    case 'duke3d':
      return <DukeNukemIcon size={14} />;
    case 'notepad':
      return <NotepadIcon size={14} />;
    case 'minesweeper':
      return <MinesweeperIcon size={14} />;
    case 'mycomputer':
      return <MyComputerIcon size={14} />;
    case 'recyclebin':
      return <RecycleBinIcon size={14} />;
    case 'display':
      return <DisplayIcon size={14} />;
    case 'paint':
      return <PaintIcon size={14} />;
    case 'calculator':
      return <CalculatorIcon size={14} />;
    case 'cmd':
      return <MsDosIcon size={14} />;
    case 'solitaire':
      return <SolitaireIcon size={14} />;
    case 'skifree':
      return <SkiFreeIcon size={14} />;
    case 'tetris':
      return <TetrisIcon size={14} />;
    case 'breakout':
      return <BreakoutIcon size={14} />;
    default:
      return null;
  }
}

export default function Taskbar({ startOpen, setStartOpen, onShutdown }) {
  const { openWindows, activeWindowId, toggleTaskbarWindow } = useWindowManager();
  const [time, setTime] = useState(() => new Date());
  const [muted, setMuted] = useState(() => getSoundMuted());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) playClickSound();
  };

  const formattedTime = time.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <>
      {startOpen && (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onShutdown={onShutdown}
        />
      )}

      <div className="win95-taskbar" onClick={(e) => e.stopPropagation()}>
        {/* Botón Inicio */}
        <button
          type="button"
          className={`win95-start-btn ${startOpen ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setStartOpen((prev) => !prev);
          }}
        >
          <WindowsFlagIcon size={16} />
          <span>Inicio</span>
        </button>

        <div className="win95-taskbar-divider" />

        {/* Botones de ventanas abiertas */}
        <div className="win95-taskbar-windows">
          {openWindows.map((win) => {
            const isFocused = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                type="button"
                className={`win95-task-btn ${isFocused ? 'active' : ''}`}
                onClick={() => {
                  setStartOpen(false);
                  toggleTaskbarWindow(win.id);
                }}
                title={win.title}
              >
                <span className="win95-task-icon">{getSmallIcon(win.appId)}</span>
                <span className="win95-task-title">{win.title}</span>
              </button>
            );
          })}
        </div>

        {/* Bandeja del sistema (System Tray) */}
        <div className="win95-tray">
          <button
            type="button"
            className="win95-tray-speaker"
            onClick={toggleMute}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            <SpeakerIcon muted={muted} size={15} />
          </button>
          <span className="win95-tray-clock" title={time.toLocaleDateString('es-ES')}>
            {formattedTime}
          </span>
        </div>
      </div>
    </>
  );
}
