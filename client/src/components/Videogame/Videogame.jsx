import React, { useState } from "react";
import style from "./Videogame.module.css";
import starIcon from "../../assets/rating-icon.png";
import { Link } from "react-router-dom";
import notImage from "../../assets/not-image.svg";
export default function Videogame({ name, image, rating, navigateTo }) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className={style.cardGame}>
      <Link
        className={style.linkToDetail}
        to={{
          pathname: navigateTo,
          state: { isLiked },
        }}
      >
        <div className={style.headCard}>
          <div className={style.nameContainer}>
            <h3>{name || "Title"}</h3>
          </div>
          <img src={image || notImage} alt="game" />
        </div>
      </Link>

      <div className={style.principalRatingContainer}>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={isLiked ? style.likedButton : style.unlikedButton}
        />
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
