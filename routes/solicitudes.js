const router = require("express").Router();
const {
  obtenerSolicitud,
  crearSolicitud,
  modificarSolicitud,
  eliminarSolicitud,
  count,
} = require("../controllers/solicitudes");

//   rutas
router.get("/", obtenerSolicitud);
router.get("/count/:id", count);
router.get("/:id", obtenerSolicitud);
router.post("/", crearSolicitud);
router.put("/:id", modificarSolicitud);
router.delete("/:id", eliminarSolicitud);

module.exports = router;
