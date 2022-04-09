import React from "react";
import style from "./FilterButton.module.css";
export default function FilterButton({
  options,
  onChange,
  name,
  labelGroup,
  disabled,
  onClick,
}) {
  return name === "filterByGenre" ? (
    <button disabled={disabled} onClick={onClick} className={style.filterCard}>
      <div className={style.filterCard}>
        <span>Filtrar por</span>
        <span>+</span>
      </div>
    </button>
  ) : (
    <div>
      <select
        disabled={disabled}
        className={style.filterCard}
        name={name}
        onChange={onChange}
      >
        <optgroup label={labelGroup}>
          <option className={style.hiddenOption} hidden>
            Selecciona algo
          </option>
          {Array.isArray(options) ? (
            options.map((option) => (
              <option key={option.id}>{option.name}</option>
            ))
          ) : (
            <option>{options}</option>
          )}
        </optgroup>
      </select>
    </div>
  );
}
