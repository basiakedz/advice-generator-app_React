import "./App.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { BiBookmarkHeart, BiHeart, BiSolidHeart } from "react-icons/bi";


Modal.setAppElement("#root");

function App() {
  const {
    fetchData,
    isLoading,
    advice,
    adviceNumber,
    favourites,
    addToFavourites,
    isInFavourites,
  } = useFetchData();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="background">
      <div className="card">
        <span id="advice" className="advice">
          ADVICE #{adviceNumber}
        </span>
        <span id="sentence" className="sentence">
          “{advice}”
        </span>
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
        <div className="hearts">
          <button
            className="add-to-favourites-button"
            id="add-to-favourites-button"
            onClick={addToFavourites}
          >
            {isInFavourites(advice) ? <BiSolidHeart /> : <BiHeart />}
          </button>
          <ModalButton favourites={favourites} />
        </div>
      </div>
    </div>
  );
}

function useFetchData() {
  const [advice, setAdvice] = useState("");
  const [adviceNumber, setAdviceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);

  const fetchData = () => {
    console.log("FETCH DATA");
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

  const addToFavourites = () => {
    if (!favourites.includes(advice)) {
      setFavourites([...favourites, advice]);
    }
  };

  const isInFavourites = (advice) => {
    return favourites.includes(advice);
  };

  return {
    fetchData,
    isLoading,
    advice,
    adviceNumber,
    favourites,
    addToFavourites,
    isInFavourites,
  };
}

function ModalButton({ favourites }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // const isInFavourites = (advice) => {
  //   return favourites.includes(advice);
  // };

  return (
    <>
      <button className="favourites-button" onClick={openModal}>
        <BiBookmarkHeart />
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div className="favourites-list">
          <h2 className="heading-favourites-list">Favourite sentences</h2>
          {favourites.length === 0 ? (
            <p className="text-favourites-list">
              No favourites added. Add sentences to favourite list so you can
              come back to them anytime you want{" "}
              <BiSolidHeart />
            </p>
          ) : (
            <ul>
              {favourites.map((favourite, index) => (
                <li key={index}>
                  {favourite}
                  {/* {isInFavourites(favourite) ? (
                    <FaHeartCircleMinus />
                  ) : ( 
                    <FaHeartCirclePlus />
                  )}  */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}

export default App;
