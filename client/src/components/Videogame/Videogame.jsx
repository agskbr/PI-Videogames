import React from "react";
import style from "./Videogame.module.css";
import starIcon from "../../assets/rating-icon.png";
import notImage from "../../assets/not-image.svg";
export default function Videogame({ name, image, rating }) {
  return (
    <div className={style.cardGame}>
      <div className={style.nameContainer}>
        <h3>{name || "Title"}</h3>
      </div>
      <img src={image || notImage} alt="game" />

      <div className={style.principalRatingContainer}>
        <div className={style.rating}>
          <div className={style.starIconContainer}>
            <img src={starIcon} alt="star" />
          </div>
          <h5>{rating}</h5>
        </div>
      </div>
    </div>
  );
}
