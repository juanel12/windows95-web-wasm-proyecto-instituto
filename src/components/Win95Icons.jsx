import React from 'react';

export function WindowsFlagIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="1" y="2" width="6" height="5" fill="#FF0000" />
      <rect x="8" y="2" width="6" height="5" fill="#00AA00" />
      <rect x="1" y="8" width="6" height="5" fill="#0055FF" />
      <rect x="8" y="8" width="6" height="5" fill="#FFCC00" />
      <rect x="1" y="2" width="1" height="11" fill="#000000" opacity="0.25" />
    </svg>
  );
}

export function DoomIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#1a0505" stroke="#800000" strokeWidth="2" />
      {/* Casco / Cráneo Doomguy estilizado */}
      <rect x="7" y="6" width="18" height="16" fill="#4a5d23" />
      <rect x="9" y="4" width="14" height="3" fill="#6b8e23" />
      <rect x="8" y="10" width="16" height="6" fill="#111111" />
      {/* Ojos rojos brillantes */}
      <rect x="10" y="12" width="4" height="2" fill="#ff2200" />
      <rect x="18" y="12" width="4" height="2" fill="#ff2200" />
      {/* Visor y boca */}
      <rect x="10" y="17" width="12" height="5" fill="#d2a679" />
      <rect x="12" y="19" width="8" height="2" fill="#550000" />
      {/* Texto DOOM */}
      <rect x="4" y="24" width="24" height="5" fill="#aa0000" />
      <rect x="6" y="25" width="3" height="3" fill="#ffcc00" />
      <rect x="11" y="25" width="3" height="3" fill="#ffcc00" />
      <rect x="16" y="25" width="3" height="3" fill="#ffcc00" />
      <rect x="21" y="25" width="4" height="3" fill="#ffcc00" />
    </svg>
  );
}

export function NotepadIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="6" y="4" width="20" height="25" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      <rect x="6" y="4" width="20" height="5" fill="#008080" />
      {/* Espiral */}
      <rect x="8" y="2" width="2" height="4" fill="#808080" />
      <rect x="13" y="2" width="2" height="4" fill="#808080" />
      <rect x="18" y="2" width="2" height="4" fill="#808080" />
      <rect x="22" y="2" width="2" height="4" fill="#808080" />
      {/* Líneas de texto */}
      <rect x="9" y="12" width="14" height="2" fill="#000080" />
      <rect x="9" y="16" width="12" height="2" fill="#404040" />
      <rect x="9" y="20" width="14" height="2" fill="#404040" />
      <rect x="9" y="24" width="9" height="2" fill="#404040" />
    </svg>
  );
}

export function MinesweeperIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      {/* Mina central */}
      <circle cx="16" cy="16" r="7" fill="#000000" />
      <rect x="15" y="5" width="2" height="22" fill="#000000" />
      <rect x="5" y="15" width="22" height="2" fill="#000000" />
      <rect x="8" y="8" width="2" height="2" fill="#000000" />
      <rect x="22" y="8" width="2" height="2" fill="#000000" />
      <rect x="8" y="22" width="2" height="2" fill="#000000" />
      <rect x="22" y="22" width="2" height="2" fill="#000000" />
      <rect x="12" y="12" width="3" height="3" fill="#ffffff" />
    </svg>
  );
}

export function MyComputerIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      {/* Monitor */}
      <rect x="5" y="3" width="22" height="16" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="7" y="5" width="18" height="12" fill="#008080" />
      <rect x="9" y="7" width="6" height="4" fill="#00ffff" opacity="0.5" />
      {/* Base */}
      <rect x="12" y="19" width="8" height="3" fill="#808080" />
      {/* Case horizontal */}
      <rect x="3" y="22" width="26" height="7" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="19" y="24" width="7" height="2" fill="#404040" />
      <rect x="6" y="24" width="3" height="2" fill="#00aa00" />
    </svg>
  );
}

export function RecycleBinIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      {/* Tapa */}
      <rect x="6" y="5" width="20" height="3" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="12" y="3" width="8" height="2" fill="#808080" stroke="#000000" strokeWidth="1" />
      {/* Cuerpo */}
      <polygon points="7,8 25,8 23,28 9,28" fill="#d8d8d8" stroke="#000000" strokeWidth="1.5" />
      {/* Símbolo reciclaje verde */}
      <rect x="12" y="14" width="8" height="2" fill="#008000" />
      <rect x="11" y="16" width="2" height="5" fill="#008000" />
      <rect x="19" y="16" width="2" height="5" fill="#008000" />
      <rect x="12" y="21" width="8" height="2" fill="#008000" />
    </svg>
  );
}

export function DisplayIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="4" y="4" width="24" height="18" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="6" y="6" width="20" height="14" fill="#000080" />
      <rect x="8" y="8" width="8" height="6" fill="#00ffff" />
      <rect x="15" y="12" width="9" height="6" fill="#ff00ff" />
      <rect x="13" y="22" width="6" height="3" fill="#808080" />
      <rect x="9" y="25" width="14" height="3" fill="#c0c0c0" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}

export function TextFileIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      <polygon points="20,3 20,9 26,9" fill="#c0c0c0" stroke="#000000" strokeWidth="1" />
      <rect x="9" y="13" width="14" height="2" fill="#000080" />
      <rect x="9" y="17" width="12" height="2" fill="#404040" />
      <rect x="9" y="21" width="14" height="2" fill="#404040" />
      <rect x="9" y="25" width="8" height="2" fill="#404040" />
    </svg>
  );
}

export function PaintIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      {/* Vaso / Paleta */}
      <ellipse cx="15" cy="18" rx="11" ry="9" fill="#f5deb3" stroke="#000000" strokeWidth="1.5" />
      <circle cx="10" cy="15" r="2.2" fill="#ff0000" />
      <circle cx="15" cy="13" r="2.2" fill="#0000ff" />
      <circle cx="20" cy="16" r="2.2" fill="#00aa00" />
      <circle cx="13" cy="21" r="2.2" fill="#ffcc00" />
      {/* Pincel */}
      <line x1="19" y1="19" x2="28" y2="5" stroke="#8b4513" strokeWidth="3" />
      <polygon points="16,22 21,20 18,17" fill="#404040" />
    </svg>
  );
}

export function CalculatorIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="6" y="3" width="20" height="26" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="9" y="6" width="14" height="5" fill="#008080" stroke="#000000" strokeWidth="1" />
      {/* Teclas */}
      <rect x="9" y="14" width="3" height="3" fill="#ffffff" stroke="#404040" strokeWidth="0.5" />
      <rect x="14" y="14" width="3" height="3" fill="#ffffff" stroke="#404040" strokeWidth="0.5" />
      <rect x="19" y="14" width="4" height="3" fill="#ff0000" stroke="#404040" strokeWidth="0.5" />
      <rect x="9" y="19" width="3" height="3" fill="#ffffff" stroke="#404040" strokeWidth="0.5" />
      <rect x="14" y="19" width="3" height="3" fill="#ffffff" stroke="#404040" strokeWidth="0.5" />
      <rect x="19" y="19" width="4" height="3" fill="#000080" stroke="#404040" strokeWidth="0.5" />
      <rect x="9" y="24" width="8" height="3" fill="#ffffff" stroke="#404040" strokeWidth="0.5" />
      <rect x="19" y="24" width="4" height="3" fill="#000080" stroke="#404040" strokeWidth="0.5" />
    </svg>
  );
}

export function MsDosIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="3" y="4" width="26" height="24" fill="#c0c0c0" stroke="#000000" strokeWidth="1.5" />
      <rect x="4" y="5" width="24" height="4" fill="#000080" />
      <rect x="5" y="10" width="22" height="16" fill="#000000" />
      {/* Texto MS-DOS */}
      <rect x="7" y="13" width="3" height="2" fill="#ffffff" />
      <rect x="7" y="15" width="1" height="4" fill="#ffffff" />
      <rect x="7" y="19" width="3" height="2" fill="#ffffff" />
      <rect x="12" y="17" width="2" height="2" fill="#ffffff" />
      <rect x="15" y="15" width="3" height="2" fill="#ffffff" />
      <rect x="19" y="19" width="5" height="2" fill="#00ff00" />
    </svg>
  );
}

export function SolitaireIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      {/* Carta trasera */}
      <rect x="4" y="6" width="16" height="22" fill="#000080" stroke="#000000" strokeWidth="1.5" />
      <rect x="6" y="8" width="12" height="18" fill="#ffffff" stroke="#000080" strokeWidth="1" />
      {/* Carta delantera */}
      <rect x="12" y="4" width="16" height="22" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      {/* Corazón / Diamante rojo */}
      <polygon points="20,10 24,15 20,20 16,15" fill="#cc0000" />
      <rect x="14" y="6" width="2" height="2" fill="#cc0000" />
      <rect x="24" y="22" width="2" height="2" fill="#cc0000" />
    </svg>
  );
}

export function SkiFreeIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#f0f8ff" stroke="#000000" strokeWidth="1.5" />
      {/* Pino verde */}
      <polygon points="23,7 28,16 18,16" fill="#008000" />
      <rect x="22" y="16" width="2" height="3" fill="#8b4513" />
      {/* Esquiador */}
      <rect x="10" y="9" width="4" height="4" fill="#ff0000" />
      <rect x="9" y="13" width="6" height="6" fill="#0000ff" />
      {/* Esquís */}
      <line x1="6" y1="21" x2="14" y2="26" stroke="#000000" strokeWidth="2" />
      <line x1="11" y1="19" x2="19" y2="24" stroke="#000000" strokeWidth="2" />
    </svg>
  );
}

export function TetrisIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="3" y="3" width="26" height="26" fill="#111122" stroke="#000000" strokeWidth="1.5" />
      {/* Pieza T */}
      <rect x="6" y="7" width="6" height="6" fill="#aa00ff" stroke="#ffffff" strokeWidth="0.8" />
      <rect x="12" y="7" width="6" height="6" fill="#aa00ff" stroke="#ffffff" strokeWidth="0.8" />
      <rect x="18" y="7" width="6" height="6" fill="#aa00ff" stroke="#ffffff" strokeWidth="0.8" />
      <rect x="12" y="13" width="6" height="6" fill="#aa00ff" stroke="#ffffff" strokeWidth="0.8" />
      {/* Pieza L */}
      <rect x="6" y="21" width="6" height="6" fill="#ff8800" stroke="#ffffff" strokeWidth="0.8" />
      <rect x="12" y="21" width="6" height="6" fill="#ff8800" stroke="#ffffff" strokeWidth="0.8" />
      {/* Pieza O */}
      <rect x="20" y="15" width="6" height="6" fill="#ffdd00" stroke="#ffffff" strokeWidth="0.8" />
      <rect x="20" y="21" width="6" height="6" fill="#ffdd00" stroke="#ffffff" strokeWidth="0.8" />
    </svg>
  );
}

export function BreakoutIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="3" y="3" width="26" height="26" fill="#000044" stroke="#000000" strokeWidth="1.5" />
      {/* Ladrillos */}
      <rect x="5" y="6" width="6" height="3" fill="#ff2222" />
      <rect x="13" y="6" width="6" height="3" fill="#ff8800" />
      <rect x="21" y="6" width="6" height="3" fill="#ff2222" />
      <rect x="5" y="11" width="6" height="3" fill="#00cc44" />
      <rect x="13" y="11" width="6" height="3" fill="#00ccff" />
      <rect x="21" y="11" width="6" height="3" fill="#00cc44" />
      {/* Bola */}
      <circle cx="17" cy="19" r="2.2" fill="#ffffff" />
      {/* Paleta */}
      <rect x="10" y="24" width="12" height="3" fill="#c0c0c0" stroke="#ffffff" strokeWidth="0.7" />
    </svg>
  );
}

export function Warcraft2Icon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#1b263b" stroke="#d4af37" strokeWidth="2" />
      {/* Espada y Escudo estilo Orcos vs Humanos */}
      <polygon points="16,5 24,10 22,22 16,27 10,22 8,10" fill="#2b4c7e" stroke="#d4af37" strokeWidth="1.5" />
      <rect x="15" y="8" width="2" height="14" fill="#e0e1dd" />
      <rect x="12" y="13" width="8" height="2" fill="#d4af37" />
      <rect x="14" y="22" width="4" height="3" fill="#aa0000" />
    </svg>
  );
}

export function DiabloIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#1a0000" stroke="#990000" strokeWidth="2" />
      {/* Cuernos y cráneo demoníaco */}
      <polygon points="6,5 11,11 8,13" fill="#aa0000" />
      <polygon points="26,5 21,11 24,13" fill="#aa0000" />
      <rect x="9" y="10" width="14" height="14" fill="#660000" />
      <rect x="11" y="14" width="3" height="3" fill="#ffcc00" />
      <rect x="18" y="14" width="3" height="3" fill="#ffcc00" />
      <rect x="12" y="20" width="8" height="2" fill="#ff3300" />
    </svg>
  );
}

export function QuakeIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#1c110a" stroke="#8b4513" strokeWidth="2" />
      {/* Emblema Q de Quake */}
      <path
        d="M8 10 C8 6, 24 6, 24 10 C24 18, 21 22, 16 22 C11 22, 8 18, 8 10 Z"
        fill="none"
        stroke="#d9822b"
        strokeWidth="3"
      />
      <rect x="15" y="16" width="2" height="10" fill="#d9822b" />
      <rect x="13" y="24" width="6" height="2" fill="#ffaa44" />
    </svg>
  );
}

export function DukeNukemIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="2" y="2" width="28" height="28" fill="#111111" stroke="#ffcc00" strokeWidth="2" />
      {/* Símbolo radioactivo / gafas de Duke */}
      <circle cx="16" cy="16" r="9" fill="#ffcc00" />
      <circle cx="16" cy="16" r="2.5" fill="#111111" />
      <polygon points="16,14 11,8 21,8" fill="#111111" />
      <polygon points="14,17 8,21 12,24" fill="#111111" />
      <polygon points="18,17 24,21 20,24" fill="#111111" />
    </svg>
  );
}

export function CordilleraSymbolIcon({ size = 18, color = '#18d474', shadow = false }) {
  const pixels = (fill) => (
    <>
      {/* Punto superior */}
      <rect x="7" y="1" width="2" height="2" fill={fill} />
      {/* Arco superior */}
      <rect x="5" y="4" width="6" height="1" fill={fill} />
      <rect x="3" y="5" width="3" height="1" fill={fill} />
      <rect x="10" y="5" width="3" height="1" fill={fill} />
      <rect x="2" y="6" width="2" height="1" fill={fill} />
      <rect x="12" y="6" width="2" height="1" fill={fill} />
      {/* C interior */}
      <rect x="6" y="7" width="4" height="1" fill={fill} />
      <rect x="5" y="8" width="2" height="1" fill={fill} />
      <rect x="10" y="8" width="2" height="1" fill={fill} />
      <rect x="4" y="9" width="2" height="4" fill={fill} />
      <rect x="5" y="13" width="2" height="1" fill={fill} />
      <rect x="10" y="13" width="2" height="1" fill={fill} />
      <rect x="6" y="14" width="4" height="1" fill={fill} />
    </>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {shadow && <g transform="translate(0.7, 0.7)">{pixels('rgba(0,0,0,0.45)')}</g>}
      <g>{pixels(color)}</g>
    </svg>
  );
}

export function SpeakerIcon({ muted = false, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      <polygon points="2,6 5,6 9,2 9,14 5,10 2,10" fill="#404040" stroke="#000000" strokeWidth="1" />
      {!muted ? (
        <>
          <path d="M11 5 C12.5 6.5, 12.5 9.5, 11 11" stroke="#000080" strokeWidth="1.5" fill="none" />
          <path d="M13 3 C15.2 5.5, 15.2 10.5, 13 13" stroke="#000080" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <line x1="11" y1="5" x2="15" y2="11" stroke="#cc0000" strokeWidth="1.8" />
          <line x1="15" y1="5" x2="11" y2="11" stroke="#cc0000" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}
