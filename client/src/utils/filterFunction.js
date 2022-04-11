const filterFunctionByAllOrCreate = (filterby, videogames) => {
  if (filterby === "Agregados por mi") {
    videogames = videogames.filter((game) => typeof game.id === "string");
  }
  if (!Array.isArray(videogames)) {
    return [];
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

const filterByGenres = (genresToFilter, videogames) => {
  if (genresToFilter.length) {
    let isMatch = {};
    for (let i = 0; i < videogames.length; i++) {
      let matchesCounter = 0;
      isMatch[videogames[i].name] = false;
      for (let index = 0; index < videogames[i].genres.length; index++) {
        if (genresToFilter.includes(videogames[i].genres[index].name)) {
          matchesCounter++;
        }
      }
      if (matchesCounter === genresToFilter.length) {
        isMatch[videogames[i].name] = true;
      }
    }
    videogames = videogames.filter((game) => isMatch[game.name]);
  }
  return videogames;
};

export {
  filterFunctionByAllOrCreate,
  filterFunctionByRatOrAlphabetic,
  filterByGenres,
};
