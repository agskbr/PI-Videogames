import React, { useState } from "react";
import { useSelector } from "react-redux";
import { filterByGenres } from "../../utils/filterFunction";
import style from "./CustomModal.module.css";

export default function CustomModal({ genres, setDisplayGames, setFilterBy }) {
  const [isSelected, setIsSelected] = useState({});
  const { videogames } = useSelector((state) => state);

  return (
    <dialog className={style.modalDialog} id="dialogId">
      <div className={style.modalHeader}>
        <span>Filtra por generos</span>
        <button
          onClick={() => document.getElementById("dialogId").close()}
          className={style.closeButton}
        >
          x
        </button>
      </div>

      <div className={style.genresContainer}>
        {genres.map((genre) => (
          <div key={genre.id} className={style.eachInput}>
            <label htmlFor={genre.name}>{genre.name}</label>
            <input
              key={genre.id}
              checked={isSelected[genre.name] ?? false}
              name={genre.name}
              value={genre.name}
              onChange={(e) => {
                if (isSelected.hasOwnProperty(e.target.name)) {
                  setIsSelected((state) => ({
                    ...state,
                    [e.target.name]: !isSelected[genre.name],
                  }));
                } else {
                  setIsSelected((state) => ({
                    ...state,
                    [e.target.name]: true,
                  }));
                }
              }}
              type={"checkbox"}
            ></input>
          </div>
        ))}
      </div>
      <div className={style.filterBtnContainer}>
        <button onClick={() => setIsSelected({})} className={style.filterBtn}>
          Borrar filtros
        </button>

        <input
          type="submit"
          onClick={() => {
            const genresSelected = [];
            for (const genre in isSelected) {
              if (isSelected[genre] === true) {
                genresSelected.push(genre.toString());
              }
            }
            setFilterBy((state) => ({
              ...state,
              filterByGenre: [...genresSelected],
            }));
            const filteredByGenreArr = filterByGenres(
              genresSelected,
              videogames
            );
            setDisplayGames([...filteredByGenreArr]);
            document.getElementById("dialogId").close();
          }}
          className={style.filterBtn}
          value="Filtrar"
        />
      </div>
    </dialog>
  );
}
