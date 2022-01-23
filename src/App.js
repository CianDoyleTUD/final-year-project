import Block from './Block.js';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar.js';
import SearchBar from './SearchBar.js';
import BlockPage from './BlockPage.js';

const sampleData = [
  { height: '0', 
  blockhash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f', 
  timestamp: '2022-01-22 18:41',
  txcount: '1',
  difficulty: '1.00',
  version: '2022-01-22 18:41',
  bits: '486,604,799',
  size: '285' }
];

function App() {
  return (
    <div className="App">
    <NavBar/>
    <SearchBar/>
      <Routes>
        <Route path="/" element={<Block blockdata={sampleData}/>}/>
        <Route path="/tx/:tx" element={<BlockPage/>}/>
      </Routes>
    </div>
    
  );
}

export default App;
