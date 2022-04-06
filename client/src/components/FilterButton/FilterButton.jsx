import React from "react";
import style from "./FilterButton.module.css";
export default function FilterButton({
  options,
  onChange,
  name,
  labelGroup,
  disabled,
}) {
  return (
    <div>
      <select
        disabled={disabled}
        className={style.filterCard}
        name={name}
        onChange={onChange}
      >
        <optgroup label={labelGroup}>
          <option hidden>Selecciona algo</option>
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
