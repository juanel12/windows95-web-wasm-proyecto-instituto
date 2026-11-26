import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import { getVirtualFiles, deleteVirtualFile } from '../utils/virtualFs';
import { TextFileIcon } from '../components/Win95Icons';

export default function MyComputerApp() {
  const { openApp } = useWindowManager();
  const [selected, setSelected] = useState('c');
  const [viewPath, setViewPath] = useState('root'); // 'root' | 'C:'
  const [files, setFiles] = useState(() => getVirtualFiles());
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const refresh = () => setFiles(getVirtualFiles());
    window.addEventListener('win95-fs-updated', refresh);
    return () => window.removeEventListener('win95-fs-updated', refresh);
  }, []);

  const items = [
    { id: 'a', label: 'Disquete de 3½ (A:)', desc: '1.44 MB — Vacío', action: null, icon: '💾' },
    { id: 'c', label: 'Disco local (C:)', desc: `${files.length} documento(s) .txt guardados en la página`, action: () => setViewPath('C:'), icon: '🖴' },
    { id: 'd', label: 'DOOM_1993 (D:)', desc: 'CD-ROM — DOOM Shareware v1.9 (WASM)', action: () => openApp('doom'), icon: '💿' },
    { id: 'ctrl', label: 'Panel de control', desc: 'Configurar Pantalla y Sonido', action: () => openApp('display'), icon: '⚙️' },
  ];

  const activeItem = items.find((i) => i.id === selected);

  if (viewPath === 'C:') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button type="button" onClick={() => setViewPath('root')}>
              ← Atrás (Mi PC)
            </button>
            <span style={{ fontSize: 11, fontWeight: 'bold' }}>C:\Mis Documentos\</span>
          </div>
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                deleteVirtualFile(selectedFile);
                setSelectedFile(null);
              }}
            >
              Eliminar {selectedFile}
            </button>
          )}
        </div>

        <div
          style={{
            flex: 1,
            background: '#ffffff',
            border: '2px inset #808080',
            padding: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
            gap: 10,
            alignContent: 'start',
            overflowY: 'auto',
          }}
        >
          {files.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', color: '#666', fontSize: 11 }}>
              No hay archivos .txt guardados en C:\. Usa el Bloc de Notas para guardar documentos dentro de la página.
            </div>
          ) : (
            files.map((vf) => (
              <div
                key={vf.name}
                onClick={() => setSelectedFile(vf.name)}
                onDoubleClick={() => openApp('notepad', { fileName: vf.name })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: 6,
                  cursor: 'pointer',
                  background: selectedFile === vf.name ? '#000080' : 'transparent',
                  color: selectedFile === vf.name ? '#ffffff' : '#000000',
                  border: selectedFile === vf.name ? '1px dotted #ffff00' : '1px solid transparent',
                }}
              >
                <TextFileIcon size={32} />
                <div style={{ fontSize: 11, marginTop: 4, wordBreak: 'break-word' }}>{vf.name}</div>
              </div>
            ))
          )}
        </div>

        <div className="status-bar" style={{ flexShrink: 0 }}>
          <p className="status-bar-field">{files.length} archivo(s) .txt</p>
          <p className="status-bar-field">Doble clic para abrir en Bloc de Notas</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div
        style={{
          flex: 1,
          background: '#ffffff',
          border: '2px inset #808080',
          padding: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 12,
          alignContent: 'start',
          overflowY: 'auto',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item.id)}
            onDoubleClick={() => item.action && item.action()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 6,
              cursor: 'pointer',
              background: selected === item.id ? '#000080' : 'transparent',
              color: selected === item.id ? '#ffffff' : '#000000',
              border: selected === item.id ? '1px dotted #ffff00' : '1px solid transparent',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: 11, wordBreak: 'break-word' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <fieldset style={{ margin: 0, padding: '6px 10px' }}>
        <legend>Información del Sistema — ITS Cordillera (Quito)</legend>
        <div style={{ fontSize: 11, lineHeight: 1.5 }}>
          <div><b>Institución:</b> Tecnológico Universitario Cordillera — Quito, Ecuador</div>
          <div><b>OS:</b> Windows 95 OSR2 Web Simulator (React + Vite)</div>
          <div><b>Procesador:</b> Intel Pentium 133 MHz (WebAssembly Ready)</div>
          <div><b>Elemento:</b> {activeItem ? activeItem.desc : 'Selecciona una unidad'}</div>
        </div>
      </fieldset>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">{items.length} objeto(s)</p>
        <p className="status-bar-field">Doble clic para abrir</p>
      </div>
    </div>
  );
}
