import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar.js';
import SearchBar from './SearchBar.js';
import BlockPage from './BlockPage.js';
import HomePage from './HomePage.js';
import React from 'react';
import AddressPage from './AddressPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/> }/>
        <Route path="/tx/:tx" element={<BlockPage/> }/>
        <Route path="/address/:addr" element={<AddressPage/> }/>
      </Routes>
    </div>
  );
}

export default App;
