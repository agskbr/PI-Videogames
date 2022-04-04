const { Router } = require("express");
const {
  videogamesController,
  videogameByIdController,
  createVideogameController,
} = require("../controllers/videogames_controller.js");
const { genresController } = require("../controllers/genres_controller.js");
const {
  platformsController,
  getPlatformsController,
} = require("../controllers/platforms_controller.js");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/videogames", videogamesController);
router.get("/videogame/:gameId", videogameByIdController);
router.post("/create/videogame", createVideogameController);
router.get("/genres", genresController);
router.get("/platforms", getPlatformsController);
router.post("/create/platform", platformsController);

module.exports = router;
