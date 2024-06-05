import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Entry } from './Entry';

export const OTExplorerComp = App;

export function init({ defaultShow }: { defaultShow?: boolean } = {}) {
  const container = document.createElement('div');
  container.style.zIndex = '10000';
  container.style.position = 'fixed';
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<Entry defaultShow={defaultShow} />);
}

// init();
