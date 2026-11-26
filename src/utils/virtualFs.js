// Sistema de archivos virtual persistido en localStorage para documentos .txt dentro de Windows 95
const VIRTUAL_FS_KEY = 'win95_virtual_files_v1';

const DEFAULT_FILES = [
  {
    name: 'notas_win95.txt',
    content: `Bienvenido a Windows 95 - Simulador Web Retro
=============================================
Proyecto: Programación Web 2
Motor: React + Vite + 98.css + js-dos (WebAssembly)

Notas rápidas:
- Haz doble clic en DOOM.exe para jugar DOOM (1993) en el navegador.
- Puedes arrastrar, minimizar, maximizar y redimensionar ventanas.
- Los archivos .txt que guardes aquí aparecen en el Escritorio y en Mi PC (C:).
`,
    updatedAt: new Date().toISOString(),
  },
];

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('win95-fs-updated'));
  }
}

export function getVirtualFiles() {
  try {
    const raw = localStorage.getItem(VIRTUAL_FS_KEY);
    if (!raw) {
      localStorage.setItem(VIRTUAL_FS_KEY, JSON.stringify(DEFAULT_FILES));
      return DEFAULT_FILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FILES;
  } catch {
    return DEFAULT_FILES;
  }
}

export function getVirtualFile(name) {
  const files = getVirtualFiles();
  return files.find((f) => f.name.toLowerCase() === name.toLowerCase()) || null;
}

export function saveVirtualFile(rawName, content) {
  const cleanName = (rawName || 'Sin título.txt').trim();
  const finalName = cleanName.toLowerCase().endsWith('.txt')
    ? cleanName
    : `${cleanName}.txt`;

  const files = getVirtualFiles();
  const now = new Date().toISOString();
  const idx = files.findIndex((f) => f.name.toLowerCase() === finalName.toLowerCase());

  let nextFiles;
  if (idx >= 0) {
    nextFiles = files.map((f, i) =>
      i === idx ? { ...f, name: finalName, content, updatedAt: now } : f
    );
  } else {
    nextFiles = [...files, { name: finalName, content, updatedAt: now }];
  }

  try {
    localStorage.setItem(VIRTUAL_FS_KEY, JSON.stringify(nextFiles));
    notifyChange();
  } catch {
    // Ignorar errores de cuota
  }
  return finalName;
}

export function deleteVirtualFile(name) {
  const files = getVirtualFiles();
  const nextFiles = files.filter((f) => f.name.toLowerCase() !== name.toLowerCase());
  try {
    localStorage.setItem(VIRTUAL_FS_KEY, JSON.stringify(nextFiles));
    notifyChange();
  } catch {
    // Ignorar
  }
}
