import React, { useState } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import {
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

export default function StartMenu({ onClose, onShutdown }) {
  const { openApp } = useWindowManager();
  const [showPrograms, setShowPrograms] = useState(false);

  const launch = (appId) => {
    openApp(appId);
    onClose();
  };

  return (
    <div
      className="window win95-start-menu"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Banda lateral vertical Windows 95 */}
      <div className="win95-start-sidebar">
        <span>
          <b>Windows</b> 95
        </span>
      </div>

      {/* Opciones del menú */}
      <div className="win95-start-items">
        <div
          className="win95-start-item has-submenu"
          onMouseEnter={() => setShowPrograms(true)}
          onMouseLeave={() => setShowPrograms(false)}
          onClick={() => setShowPrograms((s) => !s)}
        >
          <span className="win95-start-icon">📁</span>
          <span className="win95-start-label"><u>P</u>rogramas</span>
          <span className="win95-start-arrow">▶</span>

          {showPrograms && (
            <div className="window win95-submenu">
              <button type="button" className="win95-start-item" onClick={() => launch('doom')}>
                <span className="win95-start-icon"><DoomIcon size={20} /></span>
                <span className="win95-start-label"><b>DOOM (1993)</b></span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('warcraft2')}>
                <span className="win95-start-icon"><Warcraft2Icon size={20} /></span>
                <span className="win95-start-label"><b>WarCraft II (1995)</b></span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('diablo')}>
                <span className="win95-start-icon"><DiabloIcon size={20} /></span>
                <span className="win95-start-label"><b>Diablo (1996)</b></span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('quake')}>
                <span className="win95-start-icon"><QuakeIcon size={20} /></span>
                <span className="win95-start-label"><b>Quake (1996)</b></span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('duke3d')}>
                <span className="win95-start-icon"><DukeNukemIcon size={20} /></span>
                <span className="win95-start-label"><b>Duke Nukem 3D</b></span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('notepad')}>
                <span className="win95-start-icon"><NotepadIcon size={20} /></span>
                <span className="win95-start-label">Bloc de notas</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('paint')}>
                <span className="win95-start-icon"><PaintIcon size={20} /></span>
                <span className="win95-start-label">Paint</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('calculator')}>
                <span className="win95-start-icon"><CalculatorIcon size={20} /></span>
                <span className="win95-start-label">Calculadora</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('cmd')}>
                <span className="win95-start-icon"><MsDosIcon size={20} /></span>
                <span className="win95-start-label">Símbolo del sistema</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('minesweeper')}>
                <span className="win95-start-icon"><MinesweeperIcon size={20} /></span>
                <span className="win95-start-label">Buscaminas</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('solitaire')}>
                <span className="win95-start-icon"><SolitaireIcon size={20} /></span>
                <span className="win95-start-label">Solitario</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('skifree')}>
                <span className="win95-start-icon"><SkiFreeIcon size={20} /></span>
                <span className="win95-start-label">SkiFree 95</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('tetris')}>
                <span className="win95-start-icon"><TetrisIcon size={20} /></span>
                <span className="win95-start-label">Tetris 95</span>
              </button>
              <button type="button" className="win95-start-item" onClick={() => launch('breakout')}>
                <span className="win95-start-icon"><BreakoutIcon size={20} /></span>
                <span className="win95-start-label">Breakout 95</span>
              </button>
            </div>
          )}
        </div>

        <button type="button" className="win95-start-item" onClick={() => launch('mycomputer')}>
          <span className="win95-start-icon"><MyComputerIcon size={20} /></span>
          <span className="win95-start-label">Mi <u>P</u>C</span>
        </button>

        <button type="button" className="win95-start-item" onClick={() => launch('display')}>
          <span className="win95-start-icon"><DisplayIcon size={20} /></span>
          <span className="win95-start-label"><u>C</u>onfiguración de Pantalla</span>
        </button>

        <button type="button" className="win95-start-item" onClick={() => launch('recyclebin')}>
          <span className="win95-start-icon"><RecycleBinIcon size={20} /></span>
          <span className="win95-start-label">Papelera de reciclaje</span>
        </button>

        <div className="win95-start-separator" />

        <button
          type="button"
          className="win95-start-item"
          onClick={() => {
            onClose();
            onShutdown();
          }}
        >
          <span className="win95-start-icon">🔌</span>
          <span className="win95-start-label"><u>A</u>pagar el sistema...</span>
        </button>
      </div>
    </div>
  );
}
