import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Videogame from "../../components/Videogame/Videogame.jsx";
import style from "./HomePage.module.css";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import {
  filterFunctionByGenreOrCreate,
  filterFunctionByRatOrAlphabetic,
} from "../../utils/filterFunction";
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
  const [displayVideogames, setDisplayVideogames] = useState([]);
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getAllVideogames());
  }, [dispatch]);
  useEffect(() => {
    setDisplayVideogames([...videogames]);
  }, [videogames]);

  const handlerChangeFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilterBy({ ...filterBy, [name]: value });
    if (!filterBy.genreOrCreate && name === "alphabeticOrRating") {
      const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(
        value,
        [...videogames]
      );
      setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
    }
    if (name === "genreOrCreate") {
      const ArrayGamesByGenreOrCreate = filterFunctionByGenreOrCreate(value, [
        ...videogames,
      ]);
      setDisplayVideogames(ArrayGamesByGenreOrCreate);
      setCounterPage({ page: 1, resultsFrom: 0, resultsTo: 15 });
    }
    if (filterBy.genreOrCreate && name === "alphabeticOrRating") {
      //Primero filtro por por: genero, creados por mi o todos
      const ArrayGamesByGenreOrCreate = filterFunctionByGenreOrCreate(
        filterBy.genreOrCreate,
        [...videogames]
      );

      //A lo obtenido antes le hago el filtrado por rating, u orden alfabetico
      const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(
        value,
        [...ArrayGamesByGenreOrCreate]
      );
      setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
    }
  };

  return (
    <div>
      <h3>Bienvenido</h3>
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
        <h4>Puedes filtrar los juegos</h4>
        <div className={style.filtersContainer}>
          <FilterButton
            name="genreOrCreate"
            disabled={isLoading}
            labelGroup="Filtrar por"
            options={[
              { id: 1, name: "Por genero" },
              { id: 2, name: "Agregados por mi" },
              { id: 3, name: "Todos" },
            ]}
            onChange={handlerChangeFilter}
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
