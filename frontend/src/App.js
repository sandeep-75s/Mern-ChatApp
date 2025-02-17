import './App.css';
import React, { useRef } from "react";
import { Route ,Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from './pages/ChatPage';
function App() {

  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
  <div className='App'>
    
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/chats" element={<ChatPage/>} />
    </Routes>
  </div>
  );
}

export default App;
