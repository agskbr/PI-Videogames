const filterFunctionByGenreOrCreate = (filterby, videogames) => {
  if (filterby === "Por genero") {
    videogames.sort((a, b) => {
      const nameA = a.genres[0]?.name.toUpperCase();
      const nameB = b.genres[0]?.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  if (filterby === "Agregados por mi") {
    videogames = videogames.filter((game) => typeof game.id === "string");
  }

  return videogames;
};

const filterFunctionByRatOrAlphabetic = (filterby, videogames) => {
  if (filterby === "Orden A-Z") {
    videogames.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  } else if (filterby === "Orden Z-A") {
    videogames.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    });
  } else if (filterby === "Rating 1-5") {
    videogames.sort((a, b) => a.rating - b.rating);
  } else {
    videogames.sort((a, b) => b.rating - a.rating);
  }
  return videogames;
};

export { filterFunctionByGenreOrCreate, filterFunctionByRatOrAlphabetic };
