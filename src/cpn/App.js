import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import './../css/index.scss';
import HelloWorld from './route/helloworld';

function App() {
    return (
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route exac path="/" element={ <HelloWorld /> }/>
                </Routes>
            </Router>
        </React.StrictMode>
    )
}

export default App;
