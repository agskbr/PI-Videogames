const { Router } = require("express");
const {
  videogamesController,
  videogameByIdController,
  createVideogame,
} = require("../controllers/videogames_controller.js");
const { genresController } = require("../controllers/genres_controller.js");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/videogames", videogamesController);
router.get("/videogame/:gameId", videogameByIdController);
router.post("/create/videogame", createVideogame);
router.get("/genres", genresController);

module.exports = router;
