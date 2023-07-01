import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const { fetchData, isLoading, advice, adviceNumber } = useFetchData();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="background">
      <div className="card">
        <span id="advice" className="advice">ADVICE #{adviceNumber}</span>
        <span id="sentence" className="sentence">“{advice}”</span>
        <div className="line">
          <span className="line-horizontally"></span>
          <div className="main-line-vertically">
            <span className="line-vertically"></span>
            <span className="line-vertically"></span>
          </div>
          <span className="line-horizontally"></span>
        </div>
        <button
          className="button"
          id="fetch-button"
          onClick={fetchData}
          disabled={isLoading}
        >
          <img
            className={`dice ${isLoading ? "loading" : ""}`}
            src="/icon-dice.svg"
            alt="Dice"
          />
        </button>
      </div>
    </div>
  );
}

function useFetchData() {
  const [advice, setAdvice] = useState("");
  const [adviceNumber, setAdviceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    fetch("https://api.adviceslip.com/advice")
      .then((response) => response.json())
      .then((data) => {
        const newAdvice = data.slip.advice;
        const newAdviceNumber = data.slip.id;

        if (advice === newAdvice || adviceNumber === newAdviceNumber) {
          fetchData();
          return;
        }

        setAdvice(newAdvice);
        setAdviceNumber(newAdviceNumber);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Wystąpił błąd:", error);
        setIsLoading(false);
      });
  };

  return { fetchData, isLoading, advice, adviceNumber };
}

export default App;
