import Block from './Block.js';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar.js';

function App() {
  return (
    <div className="App">
    <NavBar/>
      <Routes>
        <Route path="/" element={<Block height="1"/>}/>
      </Routes>
    </div>
    
  );
}

export default App;
