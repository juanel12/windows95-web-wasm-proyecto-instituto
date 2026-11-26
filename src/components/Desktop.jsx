import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import { playStartupSound } from '../utils/win95Sound';
import {
  DoomIcon,
  NotepadIcon,
  MinesweeperIcon,
  MyComputerIcon,
  RecycleBinIcon,
  DisplayIcon,
  TextFileIcon,
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
  CordilleraSymbolIcon,
} from './Win95Icons';
import { getVirtualFiles } from '../utils/virtualFs';
import Win95Window from './Win95Window';
import Taskbar from './Taskbar';
import DoomApp from '../apps/DoomApp';
import NotepadApp from '../apps/NotepadApp';
import MinesweeperApp from '../apps/MinesweeperApp';
import MyComputerApp from '../apps/MyComputerApp';
import RecycleBinApp from '../apps/RecycleBinApp';
import DisplayApp from '../apps/DisplayApp';
import PaintApp from '../apps/PaintApp';
import CalculatorApp from '../apps/CalculatorApp';
import MsDosApp from '../apps/MsDosApp';
import SolitaireApp from '../apps/SolitaireApp';
import SkiFreeApp from '../apps/SkiFreeApp';
import TetrisApp from '../apps/TetrisApp';
import BreakoutApp from '../apps/BreakoutApp';
import Warcraft2App from '../apps/Warcraft2App';
import DiabloApp from '../apps/DiabloApp';
import QuakeApp from '../apps/QuakeApp';
import DukeNukemApp from '../apps/DukeNukemApp';

const DESKTOP_ICONS = [
  { id: 'doom', label: 'DOOM.exe', featured: true, icon: <DoomIcon size={36} /> },
  { id: 'warcraft2', label: 'Warcraft II', featured: true, icon: <Warcraft2Icon size={36} /> },
  { id: 'diablo', label: 'Diablo.exe', featured: true, icon: <DiabloIcon size={36} /> },
  { id: 'quake', label: 'Quake.exe', featured: true, icon: <QuakeIcon size={36} /> },
  { id: 'duke3d', label: 'Duke3D.exe', featured: true, icon: <DukeNukemIcon size={36} /> },
  { id: 'mycomputer', label: 'Mi PC', icon: <MyComputerIcon size={36} /> },
  { id: 'notepad', label: 'Bloc de Notas', icon: <NotepadIcon size={36} /> },
  { id: 'paint', label: 'Paint', icon: <PaintIcon size={36} /> },
  { id: 'calculator', label: 'Calculadora', icon: <CalculatorIcon size={36} /> },
  { id: 'cmd', label: 'MS-DOS', icon: <MsDosIcon size={36} /> },
  { id: 'minesweeper', label: 'Buscaminas', icon: <MinesweeperIcon size={36} /> },
  { id: 'solitaire', label: 'Solitario', icon: <SolitaireIcon size={36} /> },
  { id: 'skifree', label: 'SkiFree 95', icon: <SkiFreeIcon size={36} /> },
  { id: 'tetris', label: 'Tetris 95', icon: <TetrisIcon size={36} /> },
  { id: 'breakout', label: 'Breakout 95', icon: <BreakoutIcon size={36} /> },
  { id: 'recyclebin', label: 'Papelera de reciclaje', icon: <RecycleBinIcon size={36} /> },
  { id: 'display', label: 'Pantalla', icon: <DisplayIcon size={36} /> },
];

function renderAppContent(win) {
  switch (win.appId) {
    case 'doom':
      return <DoomApp windowId={win.id} />;
    case 'notepad':
      return (
        <NotepadApp
          windowId={win.id}
          payload={win.payload}
          payloadSeq={win.payloadSeq}
        />
      );
    case 'minesweeper':
      return <MinesweeperApp windowId={win.id} />;
    case 'mycomputer':
      return <MyComputerApp windowId={win.id} />;
    case 'recyclebin':
      return <RecycleBinApp windowId={win.id} />;
    case 'display':
      return <DisplayApp windowId={win.id} />;
    case 'paint':
      return <PaintApp windowId={win.id} />;
    case 'calculator':
      return <CalculatorApp windowId={win.id} />;
    case 'cmd':
      return <MsDosApp windowId={win.id} />;
    case 'solitaire':
      return <SolitaireApp windowId={win.id} />;
    case 'skifree':
      return <SkiFreeApp windowId={win.id} />;
    case 'tetris':
      return <TetrisApp windowId={win.id} />;
    case 'breakout':
      return <BreakoutApp windowId={win.id} />;
    case 'warcraft2':
      return <Warcraft2App windowId={win.id} />;
    case 'diablo':
      return <DiabloApp windowId={win.id} />;
    case 'quake':
      return <QuakeApp windowId={win.id} />;
    case 'duke3d':
      return <DukeNukemApp windowId={win.id} />;
    default:
      return null;
  }
}

function getTitleIcon(appId) {
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

export default function Desktop() {
  const { openWindows, wallpaper, openApp } = useWindowManager();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [virtualFiles, setVirtualFiles] = useState(() => getVirtualFiles());
  const startupPlayedRef = useRef(false);

  useEffect(() => {
    const refreshFs = () => setVirtualFiles(getVirtualFiles());
    window.addEventListener('win95-fs-updated', refreshFs);
    return () => window.removeEventListener('win95-fs-updated', refreshFs);
  }, []);

  // Reproducir sonido clásico de bienvenida de Windows 95 en la primera interacción
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!startupPlayedRef.current) {
        startupPlayedRef.current = true;
        playStartupSound();
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  if (isShutdown) {
    return (
      <div className="win95-shutdown-screen">
        <div className="win95-shutdown-text">
          Ahora puede apagar el equipo de forma segura.
        </div>
        <button
          type="button"
          onClick={() => {
            setIsShutdown(false);
            playStartupSound();
          }}
        >
          Reiniciar Windows 95
        </button>
      </div>
    );
  }

  return (
    <div
      className={`win95-desktop win95-bg-${wallpaper}`}
      onClick={() => {
        setSelectedIcon(null);
        setStartOpen(false);
      }}
    >
      {/* Fondo retro temático Instituto Cordillera (símbolo + texto pixel art) */}
      {wallpaper === 'cordillera' && (
        <div className="win95-cordillera-watermark" aria-hidden="true">
          <div className="win95-cordillera-pixel-wrap">
            <CordilleraSymbolIcon size={200} color="#1ee07f" shadow />
            <div className="win95-cordillera-pixel-text">CORDILLERA</div>
          </div>
        </div>
      )}

      {/* Iconos del escritorio */}
      <div className="win95-desktop-icons">
        {DESKTOP_ICONS.map((item) => {
          const isSelected = selectedIcon === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`win95-desktop-icon ${isSelected ? 'selected' : ''} ${
                item.featured ? 'featured' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setStartOpen(false);
                setSelectedIcon(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setStartOpen(false);
                openApp(item.id);
              }}
              title="Doble clic para abrir"
            >
              <div className="win95-icon-graphic">
                {item.icon}
                {item.featured && <span className="win95-doom-badge">WASM</span>}
              </div>
              <span className="win95-icon-label">{item.label}</span>
            </button>
          );
        })}

        {/* Documentos .txt guardados dentro de la página */}
        {virtualFiles.map((vf) => {
          const iconKey = `file:${vf.name}`;
          const isSelected = selectedIcon === iconKey;
          return (
            <button
              key={iconKey}
              type="button"
              className={`win95-desktop-icon ${isSelected ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setStartOpen(false);
                setSelectedIcon(iconKey);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setStartOpen(false);
                openApp('notepad', { fileName: vf.name });
              }}
              title={`Doble clic para abrir ${vf.name}`}
            >
              <div className="win95-icon-graphic">
                <TextFileIcon size={36} />
              </div>
              <span className="win95-icon-label">{vf.name}</span>
            </button>
          );
        })}
      </div>

      {/* Ventanas abiertas */}
      {openWindows.map((win) => (
        <Win95Window key={win.id} win={win} icon={getTitleIcon(win.appId)}>
          {renderAppContent(win)}
        </Win95Window>
      ))}

      {/* Barra de tareas y Menú Inicio */}
      <Taskbar
        startOpen={startOpen}
        setStartOpen={setStartOpen}
        onShutdown={() => setIsShutdown(true)}
      />
    </div>
  );
}
