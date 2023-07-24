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
        <span id="advice" className="card__advice">
          ADVICE #{adviceNumber}
        </span>
        <span id="quote" className="card__quote">
          “{advice}”
        </span>
        <div className="card__line">
          <span className="card__line-horizontally"></span>
          <div className="card__main-line-vertically">
            <span className="card__line-vertically"></span>
            <span className="card__line-vertically"></span>
          </div>
          <span className="card__line-horizontally"></span>
        </div>

        <button
          className="button"
          id="fetch-button"
          onClick={fetchData}
          disabled={isLoading}
        >
          <img
            className={`button__dice ${isLoading ? "button__loading" : ""}`}
            src="/icon-dice.svg"
            alt="Dice"
          />
        </button>
        <div className="favourites">
          <button
            className="favourites__add-to-favourites-button"
            id="add-to-favourites-button"
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

  useEffect(() => {
    const existingFavourites = localStorage.getItem("favourites");
    if (existingFavourites) {
      setFavourites(JSON.parse(existingFavourites));
    }
  }, []);

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

  const addToFavourites = (advice) => {
    if (!favourites.includes(advice)) {
      const updatedFavourites = [...favourites, advice];
      setFavourites(updatedFavourites);
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    }
  };

  const removeFromFavourites = (advice) => {
    const updatedFavourites = favourites.filter(
      (favourite) => favourite !== advice
    );
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
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
      <button
        className="favourites__saved-favourites-button"
        onClick={openModal}
      >
        <BiBookmarkHeart />
      </button>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Example Modal"
        className="modal"
        shouldCloseOnEsc={true}
        onRequestClose={closeModal}
      >
        <div className="favourite-list__container">
          <div>
            <button className="modal__close-button" onClick={closeModal}>
              <BiX />
            </button>
            <h2 className="favourite-list__heading">Favourite quotes</h2>
          </div>

          {favourites.length === 0 ? (
            <p className="favourite-list__empty">
              No favourites added. Add quotes to favourite list so you can come
              back to them anytime you want <BiSolidHeart />
            </p>
          ) : (
            <ul className="favourite-list">
              {favourites.map((favourite, index) => (
                <li className="favourite-list__quotes" key={index}>
                  {favourite}
                  <button
                    className="favourite-list__delete-button"
                    onClick={() => removeFromFavourites(favourite)}
                  >
                    <BiTrash className="favourite-list__delete-icon" />
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
