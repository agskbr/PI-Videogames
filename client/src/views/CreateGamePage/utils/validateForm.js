const validateForm = (inputs) => {
  let errors = {};

  if (!inputs.name) {
    errors.name = "El nombre es obligatorio";
  }
  if (!inputs.description) {
    errors.description = "La descripcion es obligatoria";
  } else if (inputs.description.length < 10) {
    errors.description = "La descripcion no puede ser tan corta";
  }

  if (!inputs.released) {
    errors.released = "La fecha de lanzamiento es requerida";
  }

  if (inputs.rating.length < 1) {
    errors.rating = "El rating es requerido";
  } else if (!/^[0-4]\.?\d{0,2}$|^5\.?0{0,2}$/.test(inputs.rating)) {
    errors.rating = "Rating solo de 1-5 o con dos decimales";
  } else if (
    !inputs.rating.includes(".") &&
    inputs.rating.split("").length > 1
  ) {
    errors.rating = 'Valores de 1-5 separados por "."';
  }

  if (inputs.platforms.length === 0) {
    errors.platoforms = "Debe elegir al menos una plataforma";
  }
  if (inputs.genres.length === 0) {
    errors.genres = "Debe elegir al menos un genero";
  }

  return errors;
};

export { validateForm };
