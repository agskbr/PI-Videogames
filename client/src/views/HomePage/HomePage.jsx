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

export default function HomePage() {
  const [searchInput, setSearchInput] = useState({ videogame: "" });
  const [counterPage, setCounterPage] = useState({ page: 1 });
  const dispatch = useDispatch();
  const { videogames, isLoading } = useSelector((state) => state);
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getAllVideogames());
  }, [dispatch]);
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
          // disabled={isLoading}
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
        <h4>Aqui se mostraran todos los juegos</h4>
        <div className={style.filtersContainer}>
          <FilterButton
            options={[
              { id: 1, name: "Por genero" },
              { id: 2, name: "Agregado por mi" },
            ]}
          />
          <FilterButton
            options={[
              { id: 1, name: "Orden alfabetico ascendendete" },
              { id: 2, name: "Orden alfabetico descendente" },
              { id: 3, name: "Por rating ascendendete" },
              { id: 4, name: "Por rating descendente" },
            ]}
          />
        </div>
        <div className={style.addVideogameCard}>
          <Link to="/videogame/create">
            <button>Agregar Juego</button>
          </Link>
        </div>
        <div className={style.gamesContainer}>
          <Link className={style.linkToDetail} to={`/videogame/detail/123`}>
            <Videogame />
          </Link>
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          <Videogame />
          {/* {isLoading ? (
            <div className={style.loadingHomepage}>{<Loader />}</div>
          ) : (
            videogames.map((game) => (
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
          )} */}
        </div>
      </div>
      <div className={style.pageControllerContainer}>
        <button
          // disabled={isLoading}
          onClick={() =>
            counterPage.page <= 1
              ? null
              : setCounterPage({ ...counterPage, page: counterPage.page - 1 })
          }
          className={
            /* isLoading ? style.pageControllerDisabled : */ style.pageController
          }
        >
          {"<"}
        </button>
        <p>{counterPage.page}</p>
        <button
          // disabled={isLoading}
          onClick={() =>
            setCounterPage({ ...counterPage, page: counterPage.page + 1 })
          }
          className={
            /* isLoading ? style.pageControllerDisabled : */ style.pageController
          }
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
