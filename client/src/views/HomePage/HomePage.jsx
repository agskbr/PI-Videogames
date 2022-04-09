import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Videogame from "../../components/Videogame/Videogame.jsx";
import style from "./HomePage.module.css";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import {
  filterByGenres,
  filterFunctionByAllOrCreate,
  filterFunctionByRatOrAlphabetic,
} from "../../utils/filterFunction";
import Loader from "../../components/Loader/Loader.jsx";
import {
  getAllVideogames,
  getVideogamesByName,
  requestPost,
} from "../../store/actions/videogame_actions";
import { getGenres } from "../../store/actions/genres-actions";
import CustomModal from "../../components/CustomModal/CustomModal.jsx";

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
    setDisplayVideogames([...videogames]);
  }, [videogames]);

  const handlerChangeFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilterBy({ ...filterBy, [name]: value });
    if (!filterBy.allOrCreate && name === "alphabeticOrRating") {
      const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(
        value,
        [...displayVideogames]
      );
      setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
    }
    if (name === "allOrCreate") {
      const ArrayGamesByAllOrCreate = filterFunctionByAllOrCreate(value, [
        ...displayVideogames,
      ]);
      setDisplayVideogames(ArrayGamesByAllOrCreate);
      setCounterPage({ page: 1, resultsFrom: 0, resultsTo: 15 });
    }
    if (value === "Todos") {
      if (filterBy.filterByGenre.length) {
        const filteredByGenresArr = filterByGenres(filterBy.filterByGenre, [
          ...videogames,
        ]);
        setDisplayVideogames([...filteredByGenresArr]);
      } else {
        setDisplayVideogames([...videogames]);
      }
      setCounterPage({ page: 1, resultsFrom: 0, resultsTo: 15 });
    }
    if (filterBy.allOrCreate && name === "alphabeticOrRating") {
      //Primero filtro por por: genero, creados por mi o todos
      const ArrayGamesByAllOrCreate = filterFunctionByAllOrCreate(
        filterBy.allOrCreate,
        [...displayVideogames]
      );

      //A lo obtenido antes le hago el filtrado por rating, u orden alfabetico
      const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(
        value,
        [...ArrayGamesByAllOrCreate]
      );
      setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
    }
  };

  return (
    <div>
      <h2>Bienvenido</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setCounterPage({ page: 1, resultsFrom: 0, resultsTo: 15 });
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
        <input
          disabled={isLoading}
          className={isLoading ? style.submitDisabledBtn : style.submitBtn}
          type="submit"
          value="Buscar"
        />
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
            onChange={handlerChangeFilter}
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
            onChange={handlerChangeFilter}
          />
          <CustomModal
            setDisplayGames={setDisplayVideogames}
            genres={genres}
            setFilterBy={setFilterBy}
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
          ) : !Array.isArray(videogames) ? (
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
    </div>
  );
}
