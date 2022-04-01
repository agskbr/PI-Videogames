import React from "react";
import { Link } from "react-router-dom";
import style from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={style.principalContainer}>
      <Link to="/home">
        <button className={style.toHomeButton}>Ingresar a Home</button>
      </Link>
    </div>
  );
}
