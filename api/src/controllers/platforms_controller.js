const { Platform } = require("../database/db.js");

const platformsController = async (req, res) => {
  try {
    if (req.body.name) {
      const { name } = req.body;
      const platform = await Platform.findOrCreate({ where: { name } });
      res.json(platform ? { created: true } : { created: false });
    } else {
      res
        .status(400)
        .json({ error: "Debe indicar el nombre de la plataforma a crear" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getPlatformsController = async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.json(platforms);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { platformsController, getPlatformsController };
