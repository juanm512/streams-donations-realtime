import { Routes, Route } from "react-router-dom";
import React from 'react';

import Header from "./components/Header";
import Home from "./components/Home";
import Streamer from "./components/Streamer";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile";
import Alerts from "./components/Alerts";

import "./App.css";

function App() {

  return (
    <main className="dark:bg-gray-800 bg-white relative h-screen">
      
        
        <Routes>
          <Route path="/" element={
            <>
            <Header />
            <Home />
            </>
          } />
          <Route path="/donatelo/:uuid" element={
            <>
            <Streamer />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header />
              <LogIn />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Header />
              <Profile />
            </>
          } />

          <Route path="/alerts/:uuid" element={<Alerts  />} />
        </Routes>
    </main>

  );
}

export default App;
