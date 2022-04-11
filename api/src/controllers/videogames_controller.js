require("dotenv").config();
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Platform, Genre } = require("../database/db");
const { Op } = require("sequelize");

const baseUrl = "https://api.rawg.io/api";

const videogamesController = async (req, res) => {
  //SI me pasan por query el nonbre del juego
  let result = [];
  try {
    if (req.query.name) {
      const { name } = req.query;
      const { data } = await axios.get(
        `${baseUrl}/games?key=${API_KEY}&search=${name}`
      );
      if (data.count === 0) {
        res.send("No se encontraron resultados para tu busqueda");
      } else {
        //Si la API me devuelve los juegos, obtengo los primeros 15
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
        //Ademas busco los juegos en mi base datos
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

          //Devuelvo un arreglo con todo lo que traigo de la api + todo lo que traigo de la DB
          res.json([...videogames, ...gamesOfDB]);
        } catch (error) {
          console.log(error);
          //Si no encuentra los juegos en la base de datos, devuelvo solo los de la api
          res.json(videogames);
        }
      }
    } else {
      //Si no me pasan la query, me piden todos los juegos (devuelvo solo 100)
      // let { data } = await axios.get(`${baseUrl}/games?key=${API_KEY}`);
      // // La api me devuelve de a 20 juegos, uso la propiedad next del objeto que me devulve para pedir la siguiente pag
      // while (result.length < 100) {
      //   result = [...result, ...data.results];
      //   let nextData = await axios.get(data.next);
      //   console.log("cambio de pagina");
      //   data = nextData.data;
      // }

      //Para optmizar los tiempos de respuesta agrego este promise all
      const promisesArr = await Promise.all([
        axios.get(`${baseUrl}/games?key=${API_KEY}`),
        axios.get(`${baseUrl}/games?key=${API_KEY}&page=2`),
        axios.get(`${baseUrl}/games?key=${API_KEY}&page=3`),
        axios.get(`${baseUrl}/games?key=${API_KEY}&page=4`),
        axios.get(`${baseUrl}/games?key=${API_KEY}&page=5`),
      ]);

      promisesArr.forEach(({ data }) => {
        result = [...result, ...data.results];
      });

      try {
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
      } catch (error) {
        console.log("Algo salio mal");
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Algo salio mal, comprueba tu conexion a internet" });
  }
};

const videogameByIdController = async (req, res) => {
  try {
    // if (!/^[0-9\b]+$/.test(req.params.gameId)) {
    //   return res.status(400).json({ error: "Parametros incorrectos" });
    // }
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
  const { name, description, released, rating, platforms, genres } = req.body;
  if (name && description && released && rating && platforms && genres) {
    //valido que los datos recibidos sean lo que espero
    const releasedIsCorrect = released.split("/");
    if (typeof rating !== "number") {
      return res.status(400).json({ error: "El rating debe ser un numero" });
    } else if (rating > 5) {
      return res
        .status(400)
        .json({ error: "El rating no puede ser mayor a 5" });
    }
    if (typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "El nombre debe ser de tipo string" });
    }
    if (typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "La descripcion debe ser de tipo string" });
    }
    if (typeof released !== "string") {
      return res.status(400).json({
        error:
          "La fecha de lanzamiento debe ser un string, con el formato: 'dd/mm/aaaa'",
      });
    } else if (
      !released.includes("/") ||
      releasedIsCorrect.length !== 3 ||
      releasedIsCorrect[0].length !== 2 ||
      releasedIsCorrect[1].length !== 2 ||
      releasedIsCorrect[2].length !== 4
    ) {
      return res.status(400).json({
        error: "El formato de la fecha debe ser obligatoriamente, 'dd/mm/aaaa'",
      });
    }
    //Valido que genres y platforms sean arrays y no esten vacios
    if (
      Array.isArray(platforms) &&
      platforms.length > 0 &&
      Array.isArray(genres) &&
      genres.length > 0
    ) {
      //Valido si platforms incluye algun dato cuyo valor no sea numero
      if (
        platforms.includes(platforms.find((plat) => typeof plat !== "number"))
      ) {
        return res.status(400).json({
          error:
            "Error en el formato de platforms, solo puedes mandar datos numericos",
        });
      }
      //Valido si genres incluye algun dato cuyo valor no sea numero
      if (genres.includes(genres.find((gen) => typeof gen !== "number"))) {
        return res.status(400).json({
          error:
            "Error en el formato de genres, solo puedes mandar datos numericos",
        });
      }
      try {
        //Busco los generos y plataformas en la DB que concuerden con el id que que recibo como body (en genres y platforms)
        const genresAvailable = await Genre.findAll({
          where: { id: genres },
        });
        const platformsAvailable = await Platform.findAll({
          where: { id: platforms },
        });

        //Valido que la logitud de los generos encontrados en la DB sea igual a la longitud que recibo en el body (genres y platforms)
        if (
          genresAvailable.length === genres.length &&
          platformsAvailable.length === platforms.length
        ) {
          const videogame = await Videogame.create({
            name,
            description,
            released,
            rating,
          });
          await videogame.addGenres(genres, videogame.id);
          await videogame.addPlatforms(platforms, videogame.id);
          res.json(videogame ? { created: true } : { created: false });
        } else {
          res.status(404).json({
            error: "La plataforma o genero no existe en la base de datos",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res
        .status(400)
        .json({ error: "Las plataformas o generos no son validos" });
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
