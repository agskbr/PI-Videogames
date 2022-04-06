require("dotenv").config();
const axios = require("axios");
const { API_KEY } = process.env;
const { Genre } = require("../database/db.js");

const baseUrl = "https://api.rawg.io/api";

const genresController = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    if (genres.length === 0) {
      const { data } = await axios.get(`${baseUrl}/genres?key=${API_KEY}`);
      for (let i = 0; i < data.results.length; i++) {
        await Genre.create({
          id: data.results[i].id,
          name: data.results[i].name,
        });
      }
      const genresCreated = await Genre.findAll();
      res.send(genresCreated);
    } else {
      res.json(genres);
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Algo salio mal, comprueba tu conexion a internet" });
  }
};

module.exports = { genresController };
