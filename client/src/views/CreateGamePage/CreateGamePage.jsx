import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGenres, requestPost } from "../../store/actions/videogame_actions";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import style from "./CreateGamePage.module.css";
export default function CreateGamePage() {
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    released: "",
    rating: 0.0,
    platoform: "",
    genres: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    released: "",
    rating: "",
    platoform: "",
    genres: "",
  });
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getGenres());
  }, [dispatch]);

  const AllowPlatforms = [
    { id: 1, name: "Playstation" },
    { id: 2, name: "Xbox" },
    { id: 3, name: "PC" },
  ];

  const handlerChange = (e) =>
    setInputs((state) => ({ ...state, [e.target.name]: e.target.value }));

  return (
    <div className={style.principalContainer}>
      <h2>Crear un nuevo juego</h2>

      <div className={style.uploadImgContainer}>
        <div>+</div>
        <label>Agrega una imagen</label>
      </div>

      <div className={style.inputsContainer}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label>Nombre del juego</label>
          <CustomInput
            value={inputs.name}
            onChange={handlerChange}
            type="text"
            name="name"
            placeholder="Ej: Grand Theft Auto"
            htmlFor="name"
            labelError={errors.name}
          />
          <label>Descripcion del juego</label>
          <CustomInput
            type="text"
            value={inputs.description}
            name="description"
            onChange={handlerChange}
            placeholder="Descripcion del juego que deseemos agregar"
            htmlFor="description"
            labelError={errors.description}
          />
          <label>Fecha de lanzamiento</label>
          <CustomInput
            type="date"
            name="released"
            value={inputs.released}
            htmlFor="released"
            onChange={handlerChange}
            labelError={errors.released}
          />
          <label>Rating que tiene</label>
          <CustomInput
            type="number"
            name="rating"
            placeholder="Ej: 4.5"
            value={inputs.rating}
            onChange={handlerChange}
            htmlFor="rating"
            labelError={errors.rating}
          />
          <div className={style.filterContainer}>
            <FilterButton options={AllowPlatforms} />
            <h6>Plataformas seleccionadas</h6>
            <br></br>
            <FilterButton
              name="genres"
              onChange={(e) => {
                setInputs((state) => {
                  if (!state.genres.includes(e.target.value)) {
                    return {
                      ...state,
                      genres: [...state.genres, e.target.value],
                    };
                  } else {
                    return {
                      ...state,
                    };
                  }
                });
              }}
              options={genres}
            />
          </div>
          <h6>Categorias seleccionadas</h6>
          <div className={style.selectedGenres}>
            <ul>
              {inputs.genres.map((genre, index) => (
                <div key={Math.random()} className={style.listItemGenres}>
                  <li key={index}>{genre}</li>
                  <button
                    key={Math.random()}
                    onClick={() => {
                      setInputs((state) => {
                        const newState = state.genres.filter(
                          (_, i) => i !== index
                        );
                        return {
                          ...state,
                          genres: newState,
                        };
                      });
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <input
              disabled={true}
              className={errors ? style.submitDisabledBtn : style.submitBtn}
              type="submit"
              value="Crear juego"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
