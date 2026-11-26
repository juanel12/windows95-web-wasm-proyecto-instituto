import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import {
  getVirtualFiles,
  getVirtualFile,
  saveVirtualFile,
  deleteVirtualFile,
} from '../utils/virtualFs';
import { playClickSound } from '../utils/win95Sound';

export default function NotepadApp({ windowId, payload, payloadSeq }) {
  const { updateWindowTitle } = useWindowManager();

  const [fileName, setFileName] = useState(() => {
    if (payload?.fileName) return payload.fileName;
    const files = getVirtualFiles();
    return files[0]?.name || 'notas_win95.txt';
  });

  const [text, setText] = useState(() => {
    const initialName = payload?.fileName || getVirtualFiles()[0]?.name || 'notas_win95.txt';
    const found = getVirtualFile(initialName);
    return found ? found.content : '';
  });

  const [isNewUntitled, setIsNewUntitled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [statusMsg, setStatusMsg] = useState('Listo (guardado en Windows 95)');

  // Diálogos internos estilo Win95 ('saveAs' | 'open' | null)
  const [dialogMode, setDialogMode] = useState(null);
  const [saveAsName, setSaveAsName] = useState('mi_documento.txt');
  const [alsoDownloadReal, setAlsoDownloadReal] = useState(false);
  const [virtualFiles, setVirtualFiles] = useState(() => getVirtualFiles());
  const [selectedOpenFile, setSelectedOpenFile] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Sincronizar cuando se abre un archivo desde el Escritorio o Mi PC
  useEffect(() => {
    if (payload?.fileName) {
      const found = getVirtualFile(payload.fileName);
      if (found) {
        setFileName(found.name);
        setText(found.content);
        setIsNewUntitled(false);
        setStatusMsg(`Abierto: ${found.name}`);
      }
    }
  }, [payload?.fileName, payloadSeq]);

  // Actualizar título de ventana
  useEffect(() => {
    updateWindowTitle(windowId, `${fileName} - Bloc de notas`);
  }, [fileName, windowId, updateWindowTitle]);

  // Escuchar cambios del sistema de archivos virtual
  useEffect(() => {
    const refresh = () => setVirtualFiles(getVirtualFiles());
    window.addEventListener('win95-fs-updated', refresh);
    return () => window.removeEventListener('win95-fs-updated', refresh);
  }, []);

  const triggerRealDownload = (name, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveInPage = () => {
    setOpenMenu(null);
    if (isNewUntitled || fileName === 'Sin título.txt') {
      setSaveAsName('mi_nota.txt');
      setDialogMode('saveAs');
      return;
    }
    const savedName = saveVirtualFile(fileName, text);
    setFileName(savedName);
    setIsNewUntitled(false);
    playClickSound();
    setStatusMsg(`Guardado en la página: "${savedName}" (Escritorio y C:)`);
  };

  const handleConfirmSaveAs = (e) => {
    e.preventDefault();
    const savedName = saveVirtualFile(saveAsName, text);
    setFileName(savedName);
    setIsNewUntitled(false);
    if (alsoDownloadReal) {
      triggerRealDownload(savedName, text);
    }
    playClickSound();
    setDialogMode(null);
    setStatusMsg(
      alsoDownloadReal
        ? `Guardado en la página y descargado: "${savedName}"`
        : `Guardado en la página: "${savedName}" (Escritorio y C:)`
    );
  };

  const handleDownloadOnly = () => {
    const dlName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    triggerRealDownload(dlName, text);
    setStatusMsg(`Descargado a tu PC real: "${dlName}"`);
    setOpenMenu(null);
  };

  const handleNew = () => {
    setText('');
    setFileName('Sin título.txt');
    setIsNewUntitled(true);
    setStatusMsg('Nuevo documento (usa Archivo -> Guardar para guardarlo en la página)');
    setOpenMenu(null);
  };

  const handleOpenDialog = () => {
    setVirtualFiles(getVirtualFiles());
    setSelectedOpenFile(fileName);
    setDialogMode('open');
    setOpenMenu(null);
  };

  const handleOpenVirtualFile = (name) => {
    const found = getVirtualFile(name);
    if (found) {
      setFileName(found.name);
      setText(found.content);
      setIsNewUntitled(false);
      setDialogMode(null);
      setStatusMsg(`Abierto: ${found.name}`);
      playClickSound();
    }
  };

  const handleOpenRealFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      const savedName = saveVirtualFile(file.name, content);
      setText(content);
      setFileName(savedName);
      setIsNewUntitled(false);
      setDialogMode(null);
      setStatusMsg(`Importado y guardado en la página: ${savedName}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const insertTimestamp = () => {
    const stamp = new Date().toLocaleString('es-ES');
    setText((prev) => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + stamp + '\n');
    setStatusMsg('Fecha y hora insertadas');
    setOpenMenu(null);
  };

  const lines = text.split('\n').length;
  const chars = text.length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
      onClick={() => openMenu && setOpenMenu(null)}
    >
      {/* Barra de menú superior */}
      <div className="win95-menubar" onClick={(e) => e.stopPropagation()}>
        <div className="win95-menu-item-wrap">
          <button
            type="button"
            className={`win95-menubar-btn ${openMenu === 'file' ? 'active' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
          >
            <u>A</u>rchivo
          </button>
          {openMenu === 'file' && (
            <div className="win95-dropdown">
              <button type="button" onClick={handleNew}>Nuevo</button>
              <button type="button" onClick={handleOpenDialog}>Abrir (Windows 95)...</button>
              <button type="button" onClick={handleSaveInPage}>
                <b>Guardar en la página</b>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveAsName(fileName === 'Sin título.txt' ? 'mi_nota.txt' : fileName);
                  setDialogMode('saveAs');
                  setOpenMenu(null);
                }}
              >
                Guardar como...
              </button>
              <div style={{ height: 1, background: '#808080', margin: '2px 4px' }} />
              <button type="button" onClick={handleDownloadOnly}>
                Descargar a PC real (.txt)
              </button>
            </div>
          )}
        </div>

        <div className="win95-menu-item-wrap">
          <button
            type="button"
            className={`win95-menubar-btn ${openMenu === 'edit' ? 'active' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
          >
            <u>E</u>dición
          </button>
          {openMenu === 'edit' && (
            <div className="win95-dropdown">
              <button type="button" onClick={insertTimestamp}>Insertar Fecha/Hora</button>
              <button type="button" onClick={() => { setText(''); setOpenMenu(null); }}>
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        <div className="win95-menu-item-wrap">
          <button
            type="button"
            className={`win95-menubar-btn ${openMenu === 'help' ? 'active' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
          >
            A<u>y</u>uda
          </button>
          {openMenu === 'help' && (
            <div className="win95-dropdown">
              <button
                type="button"
                onClick={() => {
                  setStatusMsg('Bloc de notas v2.0 — Guarda archivos .txt en la página');
                  setOpenMenu(null);
                }}
              >
                Acerca del Bloc de notas
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        style={{ display: 'none' }}
        onChange={handleOpenRealFile}
      />

      {/* Área de texto */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setStatusMsg('Sin guardar — Usa Archivo -> Guardar en la página');
        }}
        spellCheck={false}
        style={{
          flex: 1,
          width: '100%',
          resize: 'none',
          fontFamily: '"Fixedsys", "Courier New", monospace',
          fontSize: 13,
          lineHeight: 1.4,
          padding: 6,
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '2px inset #808080',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div className="status-bar" style={{ marginTop: 2, flexShrink: 0 }}>
        <p className="status-bar-field">{statusMsg}</p>
        <p className="status-bar-field">Líneas: {lines}</p>
        <p className="status-bar-field">Caracteres: {chars}</p>
      </div>

      {/* Diálogo retro Guardar como (dentro de Windows 95) */}
      {dialogMode === 'saveAs' && (
        <div className="win95-modal-overlay">
          <form className="window win95-modal-dialog" onSubmit={handleConfirmSaveAs}>
            <div className="title-bar">
              <div className="title-bar-text">Guardar en Windows 95</div>
              <div className="title-bar-controls">
                <button type="button" aria-label="Close" onClick={() => setDialogMode(null)} />
              </div>
            </div>
            <div className="window-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="field-row-stacked">
                <label htmlFor="win95-save-name">Nombre del archivo (.txt):</label>
                <input
                  id="win95-save-name"
                  type="text"
                  value={saveAsName}
                  onChange={(e) => setSaveAsName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="field-row">
                <input
                  id="win95-also-dl"
                  type="checkbox"
                  checked={alsoDownloadReal}
                  onChange={(e) => setAlsoDownloadReal(e.target.checked)}
                />
                <label htmlFor="win95-also-dl">También descargar copia a mi PC real</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setDialogMode(null)}>Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Diálogo retro Abrir archivo guardado en la página */}
      {dialogMode === 'open' && (
        <div className="win95-modal-overlay">
          <div className="window win95-modal-dialog" style={{ width: 320 }}>
            <div className="title-bar">
              <div className="title-bar-text">Abrir desde Windows 95 (C:\)</div>
              <div className="title-bar-controls">
                <button type="button" aria-label="Close" onClick={() => setDialogMode(null)} />
              </div>
            </div>
            <div className="window-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11 }}>Documentos guardados dentro de la página:</div>
              <div
                className="sunken-panel"
                style={{ height: 130, overflowY: 'auto', background: '#ffffff', padding: 2 }}
              >
                {virtualFiles.length === 0 ? (
                  <div style={{ padding: 10, color: '#666', fontSize: 11 }}>
                    No hay documentos guardados aún.
                  </div>
                ) : (
                  virtualFiles.map((vf) => (
                    <div
                      key={vf.name}
                      onClick={() => setSelectedOpenFile(vf.name)}
                      onDoubleClick={() => handleOpenVirtualFile(vf.name)}
                      style={{
                        padding: '3px 6px',
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        background: selectedOpenFile === vf.name ? '#000080' : 'transparent',
                        color: selectedOpenFile === vf.name ? '#ffffff' : '#000000',
                      }}
                    >
                      <span>📄 {vf.name}</span>
                      <span style={{ opacity: 0.75 }}>{vf.content.length} B</span>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  Importar de PC real...
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    disabled={!selectedOpenFile}
                    onClick={() => selectedOpenFile && handleOpenVirtualFile(selectedOpenFile)}
                  >
                    Abrir
                  </button>
                  {selectedOpenFile && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteVirtualFile(selectedOpenFile);
                        setSelectedOpenFile(null);
                      }}
                      title="Eliminar documento"
                    >
                      Borrar
                    </button>
                  )}
                  <button type="button" onClick={() => setDialogMode(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
