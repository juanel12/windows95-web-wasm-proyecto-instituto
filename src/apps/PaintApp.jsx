import React, { useRef, useState, useEffect } from 'react';
import { playClickSound } from '../utils/win95Sound';

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040',
];

const TOOLS = [
  { id: 'pencil', label: '✏️ Lápiz' },
  { id: 'eraser', label: '🧽 Borrador' },
  { id: 'line', label: '📏 Línea' },
  { id: 'rect', label: '⬜ Rectángulo' },
  { id: 'circle', label: '⭕ Círculo' },
  { id: 'fill', label: '🪣 Relleno' },
];

export default function PaintApp() {
  const canvasRef = useRef(null);
  const snapshotRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);

  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  };

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.substring(0, 2), 16),
      parseInt(clean.substring(2, 4), 16),
      parseInt(clean.substring(4, 6), 16),
      255,
    ];
  };

  const floodFill = (startX, startY, fillHex) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const startIdx = (startY * width + startX) * 4;
    const target = [data[startIdx], data[startIdx + 1], data[startIdx + 2], data[startIdx + 3]];
    const replacement = hexToRgb(fillHex);

    if (
      target[0] === replacement[0] &&
      target[1] === replacement[1] &&
      target[2] === replacement[2] &&
      target[3] === replacement[3]
    ) {
      return;
    }

    const match = (idx) =>
      data[idx] === target[0] &&
      data[idx + 1] === target[1] &&
      data[idx + 2] === target[2] &&
      data[idx + 3] === target[3];

    const stack = [[startX, startY]];
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const idx = (y * width + x) * 4;
      if (!match(idx)) continue;

      data[idx] = replacement[0];
      data[idx + 1] = replacement[1];
      data[idx + 2] = replacement[2];
      data[idx + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handlePointerDown = (e) => {
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, color);
      playClickSound();
      return;
    }

    isDrawingRef.current = true;
    startPosRef.current = pos;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineTo(pos.x + 0.01, pos.y + 0.01);
      ctx.stroke();
    } else {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  const handlePointerMove = (e) => {
    const pos = getPos(e);
    setCoords(pos);
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      return;
    }

    if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
    }

    const start = startPosRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();

    if (tool === 'line') {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rect') {
      ctx.strokeRect(start.x, start.y, pos.x - start.x, pos.y - start.y);
    } else if (tool === 'circle') {
      const rx = Math.abs(pos.x - start.x) / 2;
      const ry = Math.abs(pos.y - start.y) / 2;
      const cx = (start.x + pos.x) / 2;
      const cy = (start.y + pos.y) / 2;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    snapshotRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playClickSound();
  };

  const handleSavePng = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dibujo_win95.png';
    a.click();
    playClickSound();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      {/* Barra superior de acciones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              style={{
                fontWeight: tool === t.id ? 'bold' : 'normal',
                background: tool === t.id ? '#dfdfdf' : undefined,
                boxShadow:
                  tool === t.id
                    ? 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080'
                    : undefined,
                padding: '2px 6px',
                fontSize: 11,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 11 }}>
            Grosor:
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ marginLeft: 4 }}
            >
              <option value={1}>1 px</option>
              <option value={3}>3 px</option>
              <option value={6}>6 px</option>
              <option value={12}>12 px</option>
            </select>
          </label>
          <button type="button" onClick={handleClear}>Limpiar</button>
          <button type="button" onClick={handleSavePng}>Guardar .png</button>
        </div>
      </div>

      {/* Área del lienzo */}
      <div
        className="sunken-panel"
        style={{
          flex: 1,
          minHeight: 0,
          background: '#808080',
          padding: 6,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <canvas
          ref={canvasRef}
          width={560}
          height={340}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            background: '#ffffff',
            cursor: 'crosshair',
            boxShadow: '2px 2px 0 #000000',
            touchAction: 'none',
          }}
        />
      </div>

      {/* Paleta inferior de colores */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px', flexShrink: 0 }}>
        <div
          style={{
            width: 26,
            height: 26,
            background: color,
            border: '2px inset #808080',
            flexShrink: 0,
          }}
          title={`Color activo: ${color}`}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(14, 16px)',
            gap: 2,
          }}
        >
          {PALETTE.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(hex)}
              style={{
                width: 16,
                height: 16,
                minWidth: 16,
                minHeight: 16,
                padding: 0,
                background: hex,
                border: color === hex ? '2px solid #ffffff' : '1px solid #404040',
                outline: color === hex ? '1px solid #000000' : 'none',
              }}
              title={hex}
            />
          ))}
        </div>
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">Herramienta: {TOOLS.find((t) => t.id === tool)?.label}</p>
        <p className="status-bar-field">{coords.x}, {coords.y} px</p>
      </div>
    </div>
  );
}
