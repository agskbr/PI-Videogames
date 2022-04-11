import React from "react";
import notFound from "../../assets/404-image.svg";
import style from "./NotFound404.module.css";

export default function NotFound404({ searching }) {
  return (
    <div className={style.notExistGame}>
      <img src={notFound} alt="notFound" />
      <div>{searching} no encontrado</div>
    </div>
  );
}
