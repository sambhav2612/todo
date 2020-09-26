import React from 'react';
import { List } from './features/list/List';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h3>To Do Application built with React and Redux</h3>
          <h6>Copyright Sambhav Jain (sambhavjain2612@gmail.com)</h6>
          <List />
      </header>
    </div>
  );
}

export default App;
