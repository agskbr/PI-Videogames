import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Videogame from "../../components/Videogame/Videogame.jsx";
import style from "./HomePage.module.css";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import {
  getAllVideogames,
  getVideogamesByName,
  requestPost,
} from "../../store/actions/videogame_actions";
import { getGenres } from "../../store/actions/genres-actions";
import CustomModal from "../../components/CustomModal/CustomModal.jsx";
import { handlerChangeFilter } from "./utils/handlerChangeFilter";
import CustomPageController from "../../components/CustomPageController/CustomPageController.jsx";

export default function HomePage() {
  const [filterBy, setFilterBy] = useState({
    allOrCreate: "",
    filterByGenre: [],
    alphabeticOrRating: "",
  });
  const [searchInput, setSearchInput] = useState({ videogame: "" });
  const [counterPage, setCounterPage] = useState({
    page: 1,
    resultsFrom: 0,
    resultsTo: 15,
  });
  const dispatch = useDispatch();
  const { videogames, isLoading, genres } = useSelector((state) => state);
  const [displayVideogames, setDisplayVideogames] = useState([]);
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getAllVideogames());
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(videogames)) {
      setDisplayVideogames([...videogames]);
    } else {
      setDisplayVideogames([]);
    }
  }, [videogames]);

  useEffect(() => {
    setCounterPage({ page: 1, resultsFrom: 0, resultsTo: 15 });
  }, [displayVideogames]);

  return (
    <div>
      <h2>Bienvenido</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(requestPost());
          dispatch(getVideogamesByName(searchInput.videogame));
        }}
      >
        <div className={style.searchBarAndBtn}>
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
          <input
            disabled={isLoading}
            className={isLoading ? style.submitDisabledBtn : style.submitBtn}
            type="submit"
            value="Buscar"
          />
        </div>
      </form>
      <div>
        <h5>Puedes filtrar los juegos</h5>
        <div className={style.filtersContainer}>
          <FilterButton
            name="allOrCreate"
            disabled={isLoading}
            labelGroup="Filtrar por"
            options={[
              { id: 2, name: "Agregados por mi" },
              { id: 3, name: "Todos" },
            ]}
            onChange={(event) => {
              handlerChangeFilter(
                event,
                setFilterBy,
                filterBy,
                videogames,
                setDisplayVideogames,
                displayVideogames
              );
            }}
          />

          <FilterButton
            name="alphabeticOrRating"
            disabled={isLoading}
            labelGroup="Filtrar por"
            options={[
              { id: 1, name: "Orden A-Z" },
              { id: 2, name: "Orden Z-A" },
              { id: 3, name: "Rating 1-5" },
              { id: 4, name: "Rating 5-1" },
            ]}
            onChange={(event) => {
              handlerChangeFilter(
                event,
                setFilterBy,
                filterBy,
                videogames,
                setDisplayVideogames,
                displayVideogames
              );
            }}
          />

          <FilterButton
            options={genres}
            name="filterByGenre"
            onClick={() => {
              document.getElementById("dialogId").showModal();
            }}
            labelGroup="Filtrar por"
            disabled={isLoading}
          />

          <CustomModal
            displayGames={displayVideogames}
            setDisplayGames={setDisplayVideogames}
            genres={genres}
            setFilterBy={setFilterBy}
          />
        </div>
        <div className={style.addVideogameCard}>
          <Link className={style.linkStyle} to="/videogame/create">
            <button>Agregar Juego</button>
          </Link>
        </div>
        <div className={style.gamesContainer}>
          {isLoading ? (
            <div className={style.loadingHomepage}>{<Loader />}</div>
          ) : displayVideogames.length < 1 ? (
            <div className={style.gamesContainer}>El juego no existe</div>
          ) : (
            displayVideogames
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
      <CustomPageController
        counterPage={counterPage}
        setCounterPage={setCounterPage}
        displayVideogames={displayVideogames}
        isLoading={isLoading}
      />
    </div>
  );
}
