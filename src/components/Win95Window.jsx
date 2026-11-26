import React, { useRef, useEffect, useCallback } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';

const TASKBAR_HEIGHT = 32;

export default function Win95Window({ win, icon, children }) {
  const {
    activeWindowId,
    positions,
    sizes,
    focusWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    closeWindow,
    updatePosition,
    updateSize,
  } = useWindowManager();

  const isActive = activeWindowId === win.id;
  const pos = positions[win.id] || { x: 60, y: 60 };
  const size = sizes[win.id] || { width: 480, height: 360 };

  const dragState = useRef(null);
  const resizeState = useRef(null);

  const handlePointerMove = useCallback(
    (e) => {
      if (dragState.current) {
        const { startX, startY, origX, origY, winW } = dragState.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const maxX = Math.max(0, window.innerWidth - Math.min(winW, 120));
        const minX = -Math.max(0, winW - 120);
        const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - 28);

        const nextX = Math.min(maxX, Math.max(minX, origX + dx));
        const nextY = Math.min(maxY, Math.max(0, origY + dy));

        updatePosition(win.id, { x: nextX, y: nextY });
      } else if (resizeState.current) {
        const { startX, startY, origW, origH } = resizeState.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const minW = win.minSize?.width || 280;
        const minH = win.minSize?.height || 220;
        const maxW = window.innerWidth - pos.x;
        const maxH = window.innerHeight - TASKBAR_HEIGHT - pos.y;

        updateSize(win.id, {
          width: Math.min(maxW, Math.max(minW, origW + dx)),
          height: Math.min(maxH, Math.max(minH, origH + dy)),
        });
      }
    },
    [win.id, win.minSize, pos.x, pos.y, updatePosition, updateSize]
  );

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    resizeState.current = null;
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const startDrag = (e) => {
    if (win.isMaximized) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    focusWindow(win.id);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      winW: size.width,
    };
    document.body.style.userSelect = 'none';
  };

  const startResize = (e) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: size.width,
      origH: size.height,
    };
    document.body.style.userSelect = 'none';
  };

  const windowStyle = win.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        zIndex: win.zIndex,
        display: win.isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'fixed',
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: size.height,
        zIndex: win.zIndex,
        display: win.isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
      };

  return (
    <div
      className="window win95-window-shell"
      style={windowStyle}
      onPointerDown={() => {
        if (!isActive) focusWindow(win.id);
      }}
    >
      <div
        className={`title-bar ${!isActive ? 'inactive' : ''}`}
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
        style={{ cursor: win.isMaximized ? 'default' : 'move', flexShrink: 0 }}
      >
        <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {icon && <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.title}</span>
        </div>
        <div className="title-bar-controls" style={{ flexShrink: 0 }}>
          <button
            type="button"
            aria-label="Minimize"
            title="Minimizar"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
          />
          <button
            type="button"
            aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
            title={win.isMaximized ? 'Restaurar' : 'Maximizar'}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(win.id);
            }}
          />
          <button
            type="button"
            aria-label="Close"
            title="Cerrar"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
          />
        </div>
      </div>

      <div
        className="window-body"
        style={{
          flex: 1,
          minHeight: 0,
          margin: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {!win.isMaximized && (
        <div
          className="win95-resize-handle"
          onPointerDown={startResize}
          title="Redimensionar"
        />
      )}
    </div>
  );
}
