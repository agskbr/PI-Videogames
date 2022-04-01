require("dotenv").config();
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame } = require("../database/db");

const baseUrl = "https://api.rawg.io/api";

const videogamesController = async (req, res) => {
  try {
    //SI me pasan por query el nonbre del juego
    let result = [];
    if (req.query.name) {
      const { name } = req.query;
      const { data } = await axios.get(
        `${baseUrl}/games?key=${API_KEY}&search=${name}`
      );
      if (data.results.length === 0) {
        res.send("No se encontraron resultados para tu busqueda");
      } else {
        result = data.results.slice(0, 15);
        const videogames = result.map((game) => {
          return {
            id: game.id,
            name: game.name,
            image: game.background_image,
            released: game.released,
            rating: game.rating,
            description: game.requirements_en,
            platforms: game.platforms,
          };
        });
        res.json(videogames);
      }
    } else {
      //Si me piden todos los juegos (devuelvo solo 100
      let { data } = await axios.get(`${baseUrl}/games?key=${API_KEY}`);
      while (result.length < 100) {
        result = [...result, ...data.results];
        let nextData = await axios.get(data.next);
        console.log("cambio de pagina");
        data = nextData.data;
      }
      const videogames = result.map((game) => {
        return {
          id: game.id,
          image: game.background_image,
          name: game.name,
          released: game.released,
          rating: game.rating,
          description: game.requirements_en,
          platforms: game.platforms,
        };
      });

      res.json(videogames);
    }
  } catch (error) {
    console.log(error);
  }
};

const videogameByIdController = async (req, res) => {
  try {
    if (!/^[0-9\b]+$/.test(req.params.gameId)) {
      return res.status(400).json({ error: "Parametros incorrectos" });
    }
    const { gameId } = req.params;
    const { data } = await axios.get(
      `${baseUrl}/games/${gameId}?key=${API_KEY}`
    );
    const videogame = {
      id: data.id,
      image: data.background_image,
      name: data.name,
      description: data.description,
      released: data.released,
      rating: data.rating,
      platforms: data.platforms,
    };

    res.send(videogame);
  } catch (error) {
    console.log(error);
  }
};

const createVideogame = async (req, res) => {
  //Funcion que genera un id teniendo en cuanta la longitud de juegos de la api
  const idGenerator = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/games?key=${API_KEY}`);
      const lengthOfGamesInDB = await Videogame.findAll();
      const lengthOfGamesInApi = data.count;
      return lengthOfGamesInApi + lengthOfGamesInDB.length + 1;
    } catch (error) {
      console.log(error);
    }
  };

  const { name, description, released, rating, platforms, genre } = req.body;
  if (name && description && released && rating && platforms && genre) {
    try {
      const videogame = await Videogame.create({
        id: await idGenerator(),
        name,
        description,
        released,
        rating,
        platforms,
      });
      await videogame.addGenres(genre, videogame.id);
      res.send({ juegoCreado: videogame });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ error: "Debe mandar todos los valores requeridos" });
  }
};

module.exports = {
  videogamesController,
  videogameByIdController,
  createVideogame,
};
