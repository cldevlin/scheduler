import { useState } from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    replace ?
      setHistory(prev => [...[...prev].slice(0, -1), newMode]) :
      setHistory(prev => [...prev, newMode]);
    setMode(newMode);

  };

  const back = () => {
    const indexOfCurrent = history.length - 1;
    indexOfCurrent > 0 && setMode(history[indexOfCurrent - 1]);
    setHistory(history.slice(0, -1));
  };
  return { mode, transition, back };
};