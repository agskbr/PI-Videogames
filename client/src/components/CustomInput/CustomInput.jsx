import React from "react";
import style from "./CustomInput.module.css";

export default function CustomInput({
  type,
  name,
  value,
  onChange,
  placeholder,
  htmlFor,
  labelError,
}) {
  return (
    <div className={style.inputContainer}>
      <input
        className={style.customInput}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
      />
      <div className={style.labelContainer}>
        <label htmlFor={htmlFor}>{labelError}</label>
      </div>
    </div>
  );
}
