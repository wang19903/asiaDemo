import React, { useState,useEffect } from "react";

const AgeGroupSelect = ({ id = -1, onSelect = () => {}, error = false }) => {
  const [startAge, setStartAge] = useState(0);
  const [endAge, setEndAge] = useState(0);

  const handleStartAgeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setStartAge(value);

    if (endAge !== null && endAge < value) {
      setEndAge(null);
    }
  };

  const handleEndAgeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setEndAge(value);

    if (startAge !== null && startAge > value) {
      setStartAge(null);
    }
  };

  useEffect(() => {
    if (startAge !== null && endAge !== null) {
      onSelect(startAge, endAge, id);
    }
  }, [startAge, endAge, id, onSelect]);

  return (
    <div className="input-container">
      <label>年齡</label>
      <div className="flex">
        <select
          value={startAge !== null ? startAge : ""}
          onChange={handleStartAgeChange}
          className="age-select left-border-radius"
        >
          {Array.from({ length: 21 }).map((_, i) => (
            <option key={i} value={i} disabled={endAge !== null && i > endAge}>
              {i}
            </option>
          ))}
        </select>
        <div className="tilde flex justify-center align-center">~</div>
        <select
          value={endAge || ""}
          onChange={handleEndAgeChange}
          className="age-select right-border-radius"
        >
          {Array.from({ length: 21 }).map((_, i) => (
            <option key={i} value={i} disabled={i < startAge}>
              {i}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error">年齡區間不可重疊</div>}
    </div>
  );
};

export default AgeGroupSelect;
