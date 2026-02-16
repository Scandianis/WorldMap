import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import WorldMap from './WorldMap'

import { createRoot } from 'react-dom/client'; // Notice the '/client'

const container = document.getElementById('root');
const root = createRoot(container); // Create the root first

root.render(
  <React.StrictMode>
    <WorldMap />
  </React.StrictMode>
);

//ReactDOM.render(<App />, document.getElementById('root'))
