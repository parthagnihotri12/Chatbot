import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './components/ChatbotIcon';
import ChatForm from './components/ChatbotForm';
import ChatMessage from './components/ChatMessage'; // make sure this is imported!

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    { role: "model", text: "Hey there 👋 How can I help you today?" }
  ]);
  const chatBodyRef = useRef();
  
  const generateBotResponse = async (history) => {
    console.log("✅ generateBotResponse called with history:", history);
  
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };
  
    // Format chat history for API request
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));
  
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
  
    try {
      console.log("📡 Sending request to:", import.meta.env.VITE_API_URL);
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      console.log("📨 Raw response:", response);
  
      const data = await response.json();
      console.log("✅ API Response JSON:", data);
  
      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }
  
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot.";
      updateHistory(botReply);
    } catch (error) {
      console.error("❌ Bot Error:", error.message);
      updateHistory("Oops! Something went wrong.");
    }
  };
  

useEffect(()=>{
  chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight,behaviour:"smooth"})
},[chatHistory]);



  return (
    
    <div className="container">
      <div className="chatbot-popup">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>

        {/* Chat Body */}
        <div   ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
