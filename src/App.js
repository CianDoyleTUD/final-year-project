import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar.js';
import SearchBar from './SearchBar.js';
import BlockPage from './BlockPage.js';
import React from 'react';

function App() {
  return (
    <div className="App">
    <NavBar/>
    <SearchBar/>
      <Routes>
        <Route path="/"/>
        <Route path="/tx/:tx" element={<BlockPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
