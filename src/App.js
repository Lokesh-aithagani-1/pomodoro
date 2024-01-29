
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Howl } from 'howler';
import './App.css';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay = ({ remainingTime }) => (
  <div className="timer-display">
    <p>{formatTime(remainingTime)}</p>
  </div>
);

const TimerControls = ({ timerActive, onToggle, customTime, onCustomTimeChange }) => (
  <div className="timer-controls">
    <button className={`start ${timerActive ? 'stop' : ''}`} onClick={onToggle}>
      {timerActive ? 'Stop' : 'Start'}
    </button>
    <Link to="/customize">
      <button className="customize">Customize</button>
    </Link>
    <button onClick={onCustomTimeChange} disabled={timerActive}>
      Reset
    </button>
  </div>
);

const CustomizePage = ({ customTime, onCustomTimeChange, onSave, onCancel }) => {
  const [newCustomTime, setNewCustomTime] = useState(customTime);

  const handleSave = () => {
    onSave(newCustomTime); 
  };

  return (
    <div className="customize-page">
      <h2>Customize Timer</h2>
      <label>
        Set time (minutes):
        <input
          type="number"
          value={newCustomTime / 60}
          onChange={(e) => setNewCustomTime(Number(e.target.value) * 60)}
        />
      </label>
      <div>
        <button onClick={handleSave} className="save">
          Save
        </button>
        <button onClick={onCancel} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [customTime, setCustomTime] = useState(1500); 
  const [remainingTime, setRemainingTime] = useState(customTime);
  const [sound, setSound] = useState(
    new Howl({
      src: ['sound.mp3'], 
      loop: true, 
    })
  );

  useEffect(() => {
    let timerId;

    if (timerActive && remainingTime > 0) {
      timerId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleTimeUp();
    }

    return () => clearInterval(timerId);
  }, [timerActive, remainingTime]);

  useEffect(() => {
    if (!timerActive) {
      sound.stop();
    }
  }, [timerActive, sound]);

  const handleStartStop = () => {
    setTimerActive((prev) => !prev);

    if (!timerActive) {
      sound.play();
    } else {
      sound.stop();
    }
  };

  const handleCustomTimeChange = (newTime) => {
    setCustomTime(newTime);
    setRemainingTime(newTime);
  };

  const handleReset = (newCustomTime) => {
    setCustomTime(newCustomTime);
    setRemainingTime(newCustomTime);
    if (timerActive) setTimerActive(false);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
  };

  return (
    <Router>
      <div className="app">
        <h1>Pomodoro Timer</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <TimerDisplay remainingTime={remainingTime} />
                <TimerControls
                  timerActive={timerActive}
                  onToggle={handleStartStop}
                  customTime={customTime}
                  onCustomTimeChange={() => handleCustomTimeChange(customTime)}
                />
              </>
            }
          />
          <Route
            path="/customize"
            element={
              <CustomizePage
                customTime={customTime}
                onCustomTimeChange={handleCustomTimeChange}
                onSave={handleReset}
                onCancel={() => window.history.back()}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
