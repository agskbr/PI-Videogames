require("dotenv").config();
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Platform, Genre } = require("../database/db");
const { Op } = require("sequelize");

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
            genres: game.genres,
            rating: game.rating,
            description: game.requirements_en,
            platforms: game.platforms,
          };
        });

        try {
          const gamesOfDB = await Videogame.findAll({
            include: [
              { model: Genre, as: "genres" },
              { model: Platform, as: "platforms" },
            ],
            where: {
              name: {
                [Op.iLike]: "%" + name + "%",
              },
            },
          });

          res.json([...videogames, ...gamesOfDB]);
        } catch (error) {
          console.log(error);
          res.json(videogames);
        }
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
      //Obtengo los juegos de la base de datos
      const videogamesOfDB = await Videogame.findAll({
        include: [
          { model: Genre, as: "genres" },
          { model: Platform, as: "platforms" },
        ],
      });
      const videogames = result.map((game) => {
        return {
          id: game.id,
          image: game.background_image,
          name: game.name,
          genres: game.genres,
          released: game.released,
          rating: game.rating,
          platforms: game.platforms,
        };
      });

      res.json([...videogames, ...videogamesOfDB]);
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
      genres: data.genres,
      description: data.description,
      released: data.released,
      rating: data.rating,
      platforms: data.platforms,
    };
    res.json(videogame);
  } catch (error) {
    try {
      const { gameId } = req.params;
      const gameOfDB = await Videogame.findByPk(gameId);
      const videogame = {
        id: gameOfDB.id,
        name: gameOfDB.name,
        description: gameOfDB.description,
        released: gameOfDB.released,
        rating: gameOfDB.rating,
        platforms: await gameOfDB.getPlatforms(),
        genres: await gameOfDB.getGenres(),
      };

      res.json(videogame);
    } catch (error) {
      res.status(404).json({ error: "El juego no existe en la base de datos" });
    }
  }
};

const createVideogameController = async (req, res) => {
  //Funcion que genera un id teniendo en cuanta la longitud de juegos de la api
  const idGenerator = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/games?key=${API_KEY}`);
      const lengthOfGamesInDB = await Videogame.findAll();
      const lengthOfGamesInApi = data.count * 10;
      return lengthOfGamesInApi + lengthOfGamesInDB.length + 1;
    } catch (error) {
      console.log(error);
    }
  };

  const { name, description, released, rating, platforms, genres } = req.body;
  if (name && description && released && rating && platforms && genres) {
    try {
      if (
        Array.isArray(platforms) &&
        platforms.length > 0 &&
        Array.isArray(genres) &&
        genres.length > 0
      ) {
        const videogame = await Videogame.create({
          id: await idGenerator(),
          name,
          description,
          released,
          rating,
        });

        const genresAvailable = await Genre.findAll({ where: { id: genres } });
        const platformsAvailable = await Platform.findAll({
          where: { id: platforms },
        });

        if (
          genresAvailable.length === genres.length &&
          platformsAvailable.length === platforms.length
        ) {
          await videogame.addGenres(genres, videogame.id);
          await videogame.addPlatforms(platforms, videogame.id);
          res.json(videogame ? { created: true } : { created: false });
        } else {
          res.status(400).json({
            error: "La plataforma o genero no existe en la base de datos",
          });
        }
      } else {
        res
          .status(400)
          .json({ error: "Las plataformas o generos no son validos" });
      }
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
  createVideogameController,
};
