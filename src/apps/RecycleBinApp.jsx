import React, { useState } from 'react';
import { playClickSound } from '../utils/win95Sound';

const INITIAL_TRASH = [
  { id: 1, name: 'Internet_Explorer_1.0.lnk', size: '2 KB', date: '24/08/1995' },
  { id: 2, name: 'clippy_alpha_backup.tmp', size: '48 KB', date: '12/11/1995' },
  { id: 3, name: 'tarea_web1_borrador.doc', size: '124 KB', date: '03/05/1996' },
];

export default function RecycleBinApp() {
  const [files, setFiles] = useState(INITIAL_TRASH);
  const [selectedId, setSelectedId] = useState(null);

  const handleEmpty = () => {
    playClickSound();
    setFiles([]);
    setSelectedId(null);
  };

  const handleRestore = () => {
    playClickSound();
    if (selectedId) {
      setFiles((prev) => prev.filter((f) => f.id !== selectedId));
      setSelectedId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button type="button" onClick={handleEmpty} disabled={files.length === 0}>
          Vaciar Papelera
        </button>
        <button type="button" onClick={handleRestore} disabled={!selectedId}>
          Restaurar elemento
        </button>
      </div>

      <div className="sunken-panel" style={{ flex: 1, background: '#ffffff', overflow: 'auto' }}>
        <table className="interactive" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 6px' }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: '4px 6px' }}>Tamaño</th>
              <th style={{ textAlign: 'left', padding: '4px 6px' }}>Fecha de eliminación</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 16, textAlign: 'center', color: '#666' }}>
                  La Papelera de reciclaje está vacía.
                </td>
              </tr>
            ) : (
              files.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  style={{
                    cursor: 'pointer',
                    background: selectedId === f.id ? '#000080' : 'transparent',
                    color: selectedId === f.id ? '#ffffff' : '#000000',
                  }}
                >
                  <td style={{ padding: '4px 6px' }}>📄 {f.name}</td>
                  <td style={{ padding: '4px 6px' }}>{f.size}</td>
                  <td style={{ padding: '4px 6px' }}>{f.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="status-bar" style={{ flexShrink: 0 }}>
        <p className="status-bar-field">{files.length} objeto(s) en la papelera</p>
      </div>
    </div>
  );
}
