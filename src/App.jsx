import React from 'react';
import { WindowManagerProvider } from './context/WindowManagerContext';
import Desktop from './components/Desktop';

export default function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}
