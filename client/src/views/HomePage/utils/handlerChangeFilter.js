import {
  filterByGenres,
  filterFunctionByAllOrCreate,
  filterFunctionByRatOrAlphabetic,
} from "../../../utils/filterFunction";

const handlerChangeFilter = (
  event,
  setFilterBy,
  filterBy,
  videogames,
  setDisplayVideogames,
  displayVideogames
) => {
  const name = event.target.name;
  const value = event.target.value;
  setFilterBy({ ...filterBy, [name]: value });
  if (!filterBy.allOrCreate && name === "alphabeticOrRating") {
    const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(value, [
      ...displayVideogames,
    ]);
    setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
  }
  if (name === "allOrCreate") {
    if (filterBy.filterByGenre.length === 0) {
      if (Array.isArray(videogames)) {
        const ArrayGamesByAllOrCreate = filterFunctionByAllOrCreate(value, [
          ...videogames,
        ]);
        setDisplayVideogames(ArrayGamesByAllOrCreate);
      } else {
        setDisplayVideogames([]);
      }
    } else {
      if (Array.isArray(videogames)) {
        const arrayGamesByAllOrCreate = filterFunctionByAllOrCreate(value, [
          ...videogames,
        ]);
        const arrFilteredByGenres = filterByGenres(
          filterBy.filterByGenre,
          arrayGamesByAllOrCreate
        );
        setDisplayVideogames(arrFilteredByGenres);
      }
    }
  }

  if (filterBy.allOrCreate && name === "alphabeticOrRating") {
    //Primero filtro por por: genero, creados por mi o todos
    const ArrayGamesByAllOrCreate = filterFunctionByAllOrCreate(
      filterBy.allOrCreate,
      [...displayVideogames]
    );

    //A lo obtenido antes le hago el filtrado por rating, u orden alfabetico
    const ArrayGamesByRatOrAlphabetic = filterFunctionByRatOrAlphabetic(value, [
      ...ArrayGamesByAllOrCreate,
    ]);
    setDisplayVideogames(ArrayGamesByRatOrAlphabetic);
  }
};

export { handlerChangeFilter };
