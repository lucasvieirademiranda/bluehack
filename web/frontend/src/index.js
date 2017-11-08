import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';

import App from './views/App';

import './index.scss';

const Entry = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(<App />, 
document.getElementById('root'));

registerServiceWorker();
