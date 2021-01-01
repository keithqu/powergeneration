import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';
import { defaultURL } from './util/config';

const App = () => {
  useEffect(() => {
    (async () => {
      const res = await axios(`${defaultURL}/api/all`)
      console.log(res.data)
    })()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
