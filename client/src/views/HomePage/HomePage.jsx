import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Videogame from "../../components/Videogame/Videogame.jsx";
import style from "./HomePage.module.css";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import { filterFunction } from "../../utils/filterFunction";
import Loader from "../../components/Loader/Loader.jsx";
import {
  getAllVideogames,
  getVideogamesByName,
  requestPost,
} from "../../store/actions/videogame_actions";

export default function HomePage() {
  const [filterBy, setFilterBy] = useState({
    genreOrCreate: "",
    alphabeticOrRating: "",
  });
  const [searchInput, setSearchInput] = useState({ videogame: "" });
  const [counterPage, setCounterPage] = useState({
    page: 1,
    resultsFrom: 0,
    resultsTo: 15,
  });
  const dispatch = useDispatch();
  const { videogames, isLoading } = useSelector((state) => state);
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getAllVideogames());
  }, [dispatch]);

  const handlerChangeFilter = (e) => {
    const value = e.target.value;
    setFilterBy({ ...filterBy, genreOrCreate: value });
    filterFunction(value, videogames);
  };
  return (
    <div>
      <h3>Bienvenido</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(requestPost());
          dispatch(getVideogamesByName(searchInput.videogame));
        }}
      >
        <input
          disabled={isLoading}
          onChange={(event) =>
            setSearchInput((state) => ({
              ...state,
              videogame: event.target.value,
            }))
          }
          value={searchInput.videogame}
          type="search"
          className={style.searchInput}
          placeholder="Buscar videojuego"
        />
        <input className={style.submitBtn} type="submit" value="Buscar" />
      </form>
      <div>
        <h4>Puedes filtrar los juegos</h4>
        <div className={style.filtersContainer}>
          <FilterButton
            labelGroup="Filtrar por"
            options={[
              { id: 1, name: "Por genero" },
              { id: 2, name: "Agregado por mi" },
            ]}
            onChange={handlerChangeFilter}
          />
          <FilterButton
            labelGroup="Filtrar por"
            options={[
              { id: 1, name: "Orden A-Z" },
              { id: 2, name: "Orden Z-A" },
              { id: 3, name: "Rating 1-5" },
              { id: 4, name: "Rating 5-1" },
            ]}
            onChange={handlerChangeFilter}
          />
        </div>
        <div className={style.addVideogameCard}>
          <Link to="/videogame/create">
            <button>Agregar Juego</button>
          </Link>
        </div>
        <div className={style.gamesContainer}>
          {isLoading ? (
            <div className={style.loadingHomepage}>{<Loader />}</div>
          ) : typeof videogames === "string" ? (
            <div className={style.gamesContainer}>El juego no existe</div>
          ) : (
            videogames
              .slice(counterPage.resultsFrom, counterPage.resultsTo)
              .map((game) => (
                <Link
                  className={style.linkToDetail}
                  key={game.id}
                  to={`/videogame/detail/${game.id}`}
                >
                  <Videogame
                    key={game.id}
                    image={game.image}
                    name={game.name}
                    rating={game.rating}
                  />
                </Link>
              ))
          )}
        </div>
      </div>
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
            videogames.slice(
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
            videogames.slice(
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
    </div>
  );
}
