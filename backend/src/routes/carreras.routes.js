const express = require("express");
const router = express.Router();
const { listarCarreras, crearCarrera } = require("../controllers/carreras.controller");

router.get("/", listarCarreras);
router.post("/", crearCarrera);

module.exports = router;
