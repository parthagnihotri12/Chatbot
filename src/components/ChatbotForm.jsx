import React, { useRef } from 'react';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Add user message to history
    setChatHistory(prev => [...prev, { role: "user", text: userMessage }]);

    // Simulate bot response after 1 second
    setTimeout(() => {
      setChatHistory(history => [
        ...history,
        { role: "model", text: "thinking..." }
      ]);
    }, 1000);

    // Call external bot response function
    generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
