import './App.css';
import React, { useState, useEffect } from "react"
import ListShips from './components/ListShips';
import ListMembers from './components/ListMembers';
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<ListShips/>}></Route> 
      <Route path="/ship/:id" element={<ListMembers/>}></Route> 
    </Routes>
  </BrowserRouter>
  );
}

export default App;
