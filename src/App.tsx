
import './App.css';
import React, { useState } from 'react';
import { processText, StepResult } from './steps/index'

function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<StepResult[]>([]);
  const [output, setOutput] = useState('');

  // Placeholder for output logic
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setInput(input);
    const results = processText(input);
    setResults(results);
    const output = results.at(-1)?.output ?? input;
    setOutput(output);
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
        <div>
        {results.map((r,i) => (
          <p key={i}><b>{r.label}</b>: {r.message}</p>
        ))}
        </div>
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
