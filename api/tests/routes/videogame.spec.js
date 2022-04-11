/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/database/db.js");

const agent = session(app);
const videogame = {
  name: "Juego test 1",
  description: "Juego test 1, descripcion de prueba",
};

describe("Videogame routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Videogame.sync({ force: true }).then(() => Videogame.create(videogame))
  );

  describe("GET /api/genres", () => {
    it("should return with status code 200", (done) => {
      agent.get("/api/genres").expect(200).end(done);
    });

    describe("POST /api/create/platform", () => {
      it("should return with status code 200", (done) => {
        agent
          .post("/api/create/platform")
          .send({ name: "Xbox" })
          .expect(200)
          .end(done);
      });
      it("should return with status code 200", (done) => {
        agent
          .post("/api/create/platform")
          .send({ name: "Playstation" })
          .expect(200)
          .end(done);
      });
    });

    describe("GET /api/videogames", () => {
      it("should return with status code 200", (done) => {
        agent.get("/api/videogames").expect(200).end(done);
      });
    });

    describe("GET /api/videogame/3498", () => {
      it("should return with status code 200", (done) => {
        agent.get("/api/videogame/3498").expect(200).end(done);
      });
      it("should return with status code 400", (done) => {
        agent.get("/api/videogame/asadasdasdasd").expect(404).end(done);
      });
    });

    describe("POST /api/create/videogame", () => {
      it("should return with status code 200", (done) => {
        const createVideogame = {
          name: "Juego test 1",
          description: "Juego test 1",
          released: "06/08/2001",
          rating: 5,
          platforms: [1],
          genres: [1, 7],
        };
        agent
          .post("/api/create/videogame")
          .send(createVideogame)
          .expect(200)
          .end(done);
      });
      it("should return with status code 400", (done) => {
        const createVideogame = {
          description: "Juego test 1",
          released: "06/08/2001",
          platforms: [1],
          genres: [1, 7],
        };
        agent
          .post("/api/create/videogame")
          .send(createVideogame)
          .expect(400)
          .end(done);
      });
    });
  });
});
