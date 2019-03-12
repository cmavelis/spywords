import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GameLoader from './GameLoader';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<GameLoader />, document.getElementById('root'));
registerServiceWorker();
