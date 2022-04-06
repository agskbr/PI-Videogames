const { Platform } = require("../database/db.js");

const platformsController = async (req, res) => {
  try {
    if (req.body.name) {
      const { name } = req.body;
      if (typeof name !== "string") {
        return res.json({
          error: "El nombre de la plataforma debe ser un string",
        });
      }
      const platform = await Platform.findOrCreate({ where: { name } });
      res.json(platform ? { created: true } : { created: false });
    } else {
      res
        .status(400)
        .json({ error: "Debe indicar el nombre de la plataforma a crear" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Algo salio mal, comprueba tu conexion a internet" });
  }
};

const getPlatformsController = async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.json(platforms);
  } catch (error) {
    console.log(error);
    res.json({ error: "Algo salio mal, comprueba tu conexion a internet" });
  }
};

module.exports = { platformsController, getPlatformsController };
