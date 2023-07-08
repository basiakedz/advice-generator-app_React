import "./App.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  BiBookmarkHeart,
  BiHeart,
  BiSolidHeart,
  BiTrash,
  BiX,
} from "react-icons/bi";

Modal.setAppElement("#root");
Modal.defaultStyles.overlay.backgroundColor = "rgba(255, 255, 255, 0.2)";

function App() {
  const {
    fetchData,
    isLoading,
    advice,
    adviceNumber,
    favourites,
    addToFavourites,
    removeFromFavourites,
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
        <span id="quote" className="quote">
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
            className="add-to-favourite-button"
            id="add-to-favourite-button"
            onClick={() => {
              if (isInFavourites(advice)) {
                removeFromFavourites(advice);
              } else {
                addToFavourites(advice);
              }
            }}
          >
            {isInFavourites(advice) ? <BiSolidHeart /> : <BiHeart />}
          </button>
          <ModalButton
            favourites={favourites}
            removeFromFavourites={removeFromFavourites}
          />
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

  const removeFromFavourites = (advice) => {
    const updatedFavourites = favourites.filter(
      (favourite) => favourite !== advice
    );
    setFavourites(updatedFavourites);
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
    removeFromFavourites,
    isInFavourites,
  };
}

function ModalButton({ favourites, removeFromFavourites }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <button className="favourite-button" onClick={openModal}>
        <BiBookmarkHeart />
      </button>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Example Modal"
        className="modal"
        shouldCloseOnEsc={true}
        onRequestClose={closeModal}
      >
        <div className="favourite-list">
          <button className="cross-button" onClick={closeModal}>
            <BiX />
          </button>
          <h2 className="heading-favourite-list">Favourite quotes</h2>
          {favourites.length === 0 ? (
            <p className="no-favourite-quotes">
              No favourites added. Add quotes to favourite list so you can come
              back to them anytime you want <BiSolidHeart />
            </p>
          ) : (
            <ul>
              {favourites.map((favourite, index) => (
                <li className="favourite-quotes" key={index}>
                  {favourite}
                  <button
                    className="trash-button"
                    onClick={() => removeFromFavourites(favourite)}
                  >
                    <BiTrash className="trash" />
                  </button>
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
