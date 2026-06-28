import React from 'react';
import { renderToString } from 'react-dom/server';
import Analytics from './src/components/Analytics.jsx';

try {
  renderToString(<Analytics />);
  console.log("Rendered successfully");
} catch (e) {
  console.error("Render failed:");
  console.error(e);
}
