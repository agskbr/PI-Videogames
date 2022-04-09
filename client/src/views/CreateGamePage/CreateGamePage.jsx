import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPost,
  createVideogame,
} from "../../store/actions/videogame_actions";
import { getGenres } from "../../store/actions/genres-actions";
import { getPlatforms } from "../../store/actions/platforms_actions";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import FilterButton from "../../components/FilterButton/FilterButton.jsx";
import { validateForm } from "./utils/validateForm";
import style from "./CreateGamePage.module.css";
export default function CreateGamePage() {
  const dispatch = useDispatch();
  const { genres, platforms } = useSelector((state) => state);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    released: "",
    rating: "",
    platforms: [],
    genres: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    released: "",
    rating: "",
    platoforms: "",
    genres: "",
  });
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getGenres());
    dispatch(getPlatforms());
  }, [dispatch]);

  const handlerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs({ ...inputs, [name]: value });
    setErrors(validateForm({ ...inputs, [name]: value }));
  };

  const hanlderSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(inputs));
    if (Object.values(errors).length === 0) {
      const genresIncludes = genres.filter((genre) =>
        inputs.genres.includes(genre.name)
      );
      const platformsIncludes = platforms.filter((platform) =>
        inputs.platforms.includes(platform.name)
      );

      const genresById = Object.values(genresIncludes).map((genre) => genre.id);
      const platformsById = Object.values(platformsIncludes).map(
        (platform) => platform.id
      );

      dispatch(
        createVideogame({
          ...inputs,
          rating: parseFloat(inputs.rating),
          released: inputs.released.split("-").reverse().join("/"),
          genres: [...genresById],
          platforms: [...platformsById],
        })
      );

      setInputs({
        name: "",
        description: "",
        released: "",
        rating: "",
        platforms: [],
        genres: [],
      });
    }
  };

  const onChangeFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((state) => {
      if (!state[name].includes(value)) {
        return {
          ...state,
          [name]: [...state[name], value],
        };
      } else {
        return {
          ...state,
        };
      }
    });
    setErrors(validateForm({ ...inputs, [name]: value }));
  };

  const deleteOptionSelected = (name, index) => {
    const newArray = inputs[name].filter((_, i) => i !== index);
    setInputs((state) => {
      return {
        ...state,
        [name]: newArray,
      };
    });
    setErrors(validateForm({ ...inputs, [name]: newArray }));
  };

  return (
    <div className={style.principalContainer}>
      <h2>Crear un nuevo juego</h2>

      <div className={style.uploadImgContainer}>
        <div>+</div>
        <label>Agrega una imagen</label>
      </div>

      <div className={style.inputsContainer}>
        <form onSubmit={hanlderSubmit}>
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
          <div className={style.textAreaContainer}>
            <textarea
              className={style.textAreaDescription}
              name="description"
              value={inputs.description}
              rows="10"
              placeholder="Aqui va la descripcion"
              onChange={handlerChange}
            />
            <label htmlFor="description">{errors.description}</label>
          </div>
          <label>Fecha de lanzamiento</label>
          <CustomInput
            type="date"
            name="released"
            min="1900-01-01"
            max="2030-12-31"
            value={inputs.released}
            htmlFor="released"
            onChange={handlerChange}
            labelError={errors.released}
          />
          <label>Rating que tiene</label>
          <CustomInput
            type="text"
            name="rating"
            placeholder="Ej: 4.5"
            value={inputs.rating}
            onChange={handlerChange}
            htmlFor="rating"
            labelError={errors.rating}
          />
          <div className={style.filterContainer}>
            <FilterButton
              options={platforms}
              labelGroup="Disponible para"
              name="platforms"
              onChange={onChangeFilter}
            />
            <label>{errors.platoforms}</label>

            <h6>Plataformas seleccionadas</h6>
            <div className={style.selectedGenres}>
              <ul>
                {inputs.platforms.map((platform, index) => (
                  <div key={Math.random()} className={style.listItemGenres}>
                    <li key={index}>{platform}</li>
                    <button
                      key={Math.random()}
                      onClick={() => deleteOptionSelected("platforms", index)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </ul>
            </div>
            <FilterButton
              labelGroup="Agrega generos"
              name="genres"
              onChange={onChangeFilter}
              options={genres}
            />
            <label>{errors.genres}</label>
            <h6>Generos seleccionados</h6>
            <div className={style.selectedGenres}>
              <ul>
                {inputs.genres.map((genre, index) => (
                  <div key={Math.random()} className={style.listItemGenres}>
                    <li key={index}>{genre}</li>
                    <button
                      key={Math.random()}
                      onClick={() => deleteOptionSelected("genres", index)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <input
              className={style.submitBtn}
              type="submit"
              value="Crear juego"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
