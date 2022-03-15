import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlockPage from './BlockPage.js';
import HomePage from './HomePage.js';
import React from 'react';
import AddressPage from './AddressPage.js';
import LoginPage from './LoginPage.js';
import AnalyticsPage from './AnalyticsPage'


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/> }/>
        <Route path="/tx/:tx" element={<BlockPage/> }/>
        <Route path="/address/:addr" element={<AddressPage/> }/>
        <Route path="/login" element={<LoginPage/> }/>
        <Route path="/analytics" element={<AnalyticsPage/> }/>
      </Routes>
    </div>
  );
}

export default App;
