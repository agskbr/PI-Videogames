import React from "react";
import style from "./FilterButton.module.css";
export default function FilterButton({ options, onChange, name, labelGroup }) {
  return (
    <div>
      <select className={style.filterCard} name={name} onChange={onChange}>
        <optgroup label={labelGroup}>
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
