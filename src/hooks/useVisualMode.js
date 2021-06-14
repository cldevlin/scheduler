import { useState } from 'react';

export default function useVisualMode(initialMode) {
  // console.log(initialMode);
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    // console.log("-------------");
    // console.log("old mode", mode);
    replace ?
      setHistory(prev => [...[...prev].slice(0, -1), newMode]) :
      setHistory(prev => [...prev, newMode]);
    // console.log("history", history);
    setMode(newMode);
    // console.log("newMod", newMode);

  };

  const back = () => {
    const indexOfCurrent = history.length - 1;
    indexOfCurrent > 0 && setMode(history[indexOfCurrent - 1]);
    setHistory(history.slice(0, -1));
  };
  // console.log(mode);
  return { mode, transition, back };
};