import React, { useEffect } from "react";
import notImage from "../../assets/not-image.svg";
import notFound from "../../assets/404-image.svg";
import {
  getVideogameById,
  requestPost,
} from "../../store/actions/videogame_actions";
import ratingIcon from "../../assets/rating-icon.png";
import style from "./DetailPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
export default function DetailPage({ gameId }) {
  const dispatch = useDispatch();
  const { videogame, isLoading } = useSelector((state) => state);
  useEffect(() => {
    dispatch(requestPost());
    dispatch(getVideogameById(gameId));
  }, [dispatch, gameId]);
  return isLoading ? (
    <div className={style.loadingVideogame}>{<Loader />}</div>
  ) : Object.values(videogame).length > 0 ? (
    <div>
      <div className={style.nameOfGame}>
        <h2>{videogame.name}</h2>
      </div>
      <div className={style.cardContainer}>
        <div className={style.cardImage}>
          <img src={videogame.image || notImage} alt="background" />
        </div>
      </div>
      <div className={style.relAndRatContainer}>
        <div className={style.releasedAndRat}>
          <div>
            <span className={style.released}>Lanzamiento:</span>{" "}
            <span className={style.releasedDate}>{videogame.released}</span>
          </div>
          <div className={style.rating}>
            <div className={style.ratingIcon}>
              <img src={ratingIcon} alt="star" />
            </div>
            <span>{videogame.rating}</span>
          </div>
        </div>
      </div>
      <div className={style.descriptionContainer}>
        <div className={style.description}>{videogame.description}</div>
      </div>
      <div className={style.platforms}>
        <div>
          Disponible para:
          <ul>
            {videogame.platforms &&
              videogame.platforms.map((platform, i) => (
                <li key={platform.id || platform.platform.id}>
                  {platform.name || platform.platform.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className={style.platforms}>
        <div>
          Generos:
          <ul>
            {videogame.genres &&
              videogame.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className={style.notExistGame}>
      <img src={notFound} alt="notFound" />
      <div>Juego no encontrado</div>
    </div>
  );
}
