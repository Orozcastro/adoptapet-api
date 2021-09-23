// Estructura del CRUD
const router = require("express").Router();
const {
  crearMascota,
  obtenerMascotas,
  modificarMascota,
  eliminarMascota,
  count,
} = require("../controllers/mascotas");

// el orden de las rutas si importa
router.get("/", obtenerMascotas);
// si son 2 get similares agregar otra ruta para distinguirlo
router.get("/count/:cat", count);
router.get("/:id", obtenerMascotas);
router.post("/", crearMascota);
router.put("/:id", modificarMascota);
router.delete("/:id", eliminarMascota);

module.exports = router;
