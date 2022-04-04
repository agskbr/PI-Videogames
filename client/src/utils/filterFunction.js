const filterFunction = (filterby, videogames) => {
  let filtered = [];
  if (filterby === "Por genero") {
    filtered = videogames.sort((a, b) => {
      const nameA = a.genres[0].name.toUpperCase();
      const nameB = b.genres[0].name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  } else if (filterby === "Agregado por mi") {
  } else if (filterby === "Orden A-Z") {
    filtered = videogames.sort((a, b) => {
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
    filtered = videogames.sort((a, b) => {
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
    filtered = videogames.sort((a, b) => a.rating - b.rating);
  } else {
    filtered = videogames.sort((a, b) => b.rating - a.rating);
  }
  return filtered;
};

export { filterFunction };
