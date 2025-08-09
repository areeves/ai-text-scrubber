
import './App.css';
import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Placeholder for output logic
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Example: just copy input to output for now
    setOutput(e.target.value);
  };

  return (
    <div className="App-form-container">
      <h1>AI Text Scrubber</h1>
      <form className="App-form" onSubmit={e => e.preventDefault()}>
        <label htmlFor="input-text">Input</label>
        <textarea
          id="input-text"
          value={input}
          onChange={handleInputChange}
          rows={8}
          className="App-textarea"
        />
        <label htmlFor="output-text">Output</label>
        <textarea
          id="output-text"
          value={output}
          readOnly
          rows={8}
          className="App-textarea App-textarea-readonly"
        />
      </form>
    </div>
  );
}

export default App;
