import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlockPage from './Pages/BlockPage.js';
import HomePage from './Pages/HomePage.js';
import React from 'react';
import AddressPage from './Pages/AddressPage.js';
import LoginPage from './Pages/LoginPage.js';
import AnalyticsPage from './Pages/AnalyticsPage'
import TransactionPage from './Pages/TransactionPage';
import AccountPage from './Pages/AccountPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/> }/>
        <Route path="/account" element={<AccountPage/> }/>
        <Route path="/tr/:tr" element={<TransactionPage/> }/>
        <Route path="/block/:block" element={<BlockPage/> }/>
        <Route path="/address/:addr" element={<AddressPage/> }/>
        <Route path="/login" element={<LoginPage/> }/>
        <Route path="/analytics" element={<AnalyticsPage/> }/>
      </Routes>
    </div>
  );
}

export default App;
