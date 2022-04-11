import React from "react";
import style from "./CustomPageController.module.css";
export default function CustomPageController({
  isLoading,
  counterPage,
  setCounterPage,
  displayVideogames,
}) {
  return (
    <div className={style.pageControllerContainer}>
      <button
        disabled={isLoading || counterPage.page === 1}
        onClick={() => {
          if (counterPage.page > 1) {
            setCounterPage({
              ...counterPage,
              page: counterPage.page - 1,
              resultsFrom: counterPage.resultsFrom - 15,
              resultsTo: counterPage.resultsTo - 15,
            });
          }
        }}
        className={
          isLoading || counterPage.page === 1
            ? style.pageControllerDisabled
            : style.pageController
        }
      >
        {"<"}
      </button>
      <p>{counterPage.page}</p>
      <button
        disabled={
          isLoading ||
          displayVideogames.slice(
            counterPage.resultsFrom + 15,
            counterPage.resultsTo + 15
          ).length === 0
        }
        onClick={() => {
          setCounterPage({
            ...counterPage,
            page: counterPage.page + 1,
            resultsFrom: counterPage.resultsFrom + 15,
            resultsTo: counterPage.resultsTo + 15,
          });
        }}
        className={
          isLoading ||
          displayVideogames.slice(
            counterPage.resultsFrom + 15,
            counterPage.resultsTo + 15
          ).length === 0
            ? style.pageControllerDisabled
            : style.pageController
        }
      >
        {">"}
      </button>
    </div>
  );
}
