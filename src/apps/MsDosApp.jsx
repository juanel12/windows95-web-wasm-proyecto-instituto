import React, { useState, useRef, useEffect } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import { getVirtualFiles, getVirtualFile } from '../utils/virtualFs';

const INITIAL_BANNER = [
  'Microsoft(R) Windows 95',
  '   (C)Copyright Microsoft Corp 1981-1995.',
  '',
  'Escribe HELP para ver la lista de comandos disponibles.',
  '',
];

export default function MsDosApp({ windowId }) {
  const { openApp, closeWindow } = useWindowManager();
  const [lines, setLines] = useState(INITIAL_BANNER);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [fgColor, setFgColor] = useState('#c0c0c0');

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [lines]);

  const appendLines = (newLines) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const runCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    const promptLine = `C:\\WINDOWS> ${rawCmd}`;

    if (!trimmed) {
      appendLines([promptLine]);
      return;
    }

    setHistory((prev) => [trimmed, ...prev]);
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toUpperCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'HELP':
        appendLines([
          promptLine,
          'Comandos disponibles:',
          '  DIR             Lista los archivos .txt guardados en C:\\',
          '  TYPE <archivo>  Muestra el contenido de un archivo .txt',
          '  ECHO <texto>    Imprime un mensaje en pantalla',
          '  DOOM            Ejecuta DOOM (1993) WebAssembly',
          '  NOTEPAD         Abre el Bloc de Notas',
          '  PAINT           Abre Microsoft Paint',
          '  CALC            Abre la Calculadora',
          '  VER             Muestra la versión del sistema',
          '  DATE / TIME     Muestra la fecha y hora actual',
          '  COLOR <green|amber|white>  Cambia el color de la terminal',
          '  CLS             Limpia la pantalla',
          '  EXIT            Cierra el Símbolo del Sistema',
          '',
        ]);
        break;

      case 'CLS':
        setLines([]);
        break;

      case 'VER':
        appendLines([promptLine, 'Windows 95 [Versión 4.00.950]', '']);
        break;

      case 'DATE':
        appendLines([
          promptLine,
          `La fecha actual es: ${new Date().toLocaleDateString('es-ES')}`,
          '',
        ]);
        break;

      case 'TIME':
        appendLines([
          promptLine,
          `La hora actual es: ${new Date().toLocaleTimeString('es-ES')}`,
          '',
        ]);
        break;

      case 'ECHO':
        appendLines([promptLine, arg || '', '']);
        break;

      case 'DIR': {
        const files = getVirtualFiles();
        const rows = [
          promptLine,
          ' El volumen de la unidad C no tiene etiqueta.',
          ' Directorio de C:\\MIS DOCUMENTOS',
          '',
          ...files.map(
            (f) =>
              ` ${f.name.padEnd(24, ' ')} ${String(f.content.length).padStart(7, ' ')} bytes`
          ),
          `        ${files.length} archivo(s)`,
          '',
        ];
        appendLines(rows);
        break;
      }

      case 'TYPE': {
        if (!arg) {
          appendLines([promptLine, 'Sintaxis incorrecta. Uso: TYPE <archivo.txt>', '']);
          break;
        }
        const found = getVirtualFile(arg);
        if (!found) {
          appendLines([promptLine, `Archivo no encontrado - ${arg}`, '']);
        } else {
          appendLines([promptLine, ...found.content.split('\n'), '']);
        }
        break;
      }

      case 'DOOM':
        appendLines([promptLine, 'Iniciando DOOM.EXE...', '']);
        openApp('doom');
        break;

      case 'NOTEPAD':
        appendLines([promptLine, 'Abriendo Bloc de Notas...', '']);
        openApp('notepad');
        break;

      case 'PAINT':
        appendLines([promptLine, 'Abriendo Paint...', '']);
        openApp('paint');
        break;

      case 'CALC':
        appendLines([promptLine, 'Abriendo Calculadora...', '']);
        openApp('calculator');
        break;

      case 'COLOR': {
        const c = arg.toLowerCase();
        if (c === 'green' || c === 'verde') setFgColor('#33ff33');
        else if (c === 'amber' || c === 'ambar') setFgColor('#ffb000');
        else setFgColor('#c0c0c0');
        appendLines([promptLine, '']);
        break;
      }

      case 'EXIT':
        closeWindow(windowId);
        break;

      default:
        appendLines([
          promptLine,
          `Comando o nombre de archivo incorrecto: "${cmd}". Escribe HELP.`,
          '',
        ]);
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(history.length - 1, histIdx + 1);
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        const nextIdx = histIdx - 1;
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      } else {
        setHistIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#000000',
        color: fgColor,
        fontFamily: '"Courier New", monospace',
        fontSize: 13,
        lineHeight: 1.35,
        padding: 8,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        cursor: 'text',
        userSelect: 'text',
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {line || '\u00A0'}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ whiteSpace: 'nowrap' }}>C:\WINDOWS&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            color: fgColor,
            fontFamily: '"Courier New", monospace',
            fontSize: 13,
            padding: 0,
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
