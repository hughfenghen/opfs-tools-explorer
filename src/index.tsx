import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Entry } from './Entry';

export const ExplorerComponent = App;

export function init() {
  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(<Entry />);
}
