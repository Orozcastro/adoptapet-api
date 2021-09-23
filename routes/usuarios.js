// Estructura del CRUD
const router = require("express").Router();
const {
  crearUsuario,
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  iniciarSesion,
} = require("../controllers/usuarios");

// servicio con autentificacion requerida
// si es requeridase pone, si no no es necesario
const auth = require("./auth");

// segundo parametro el auth
router.get("/", auth.requerido, obtenerUsuarios); // si es requerida, si no manda jwt no tiene acceso als ervicio
router.get("/:id", auth.requerido, obtenerUsuarios);
router.post("/", auth.opcional, crearUsuario); // no necesita auth, no se puede autenfificar algo que no existe
router.post("/entrar", iniciarSesion); //login como post, no necesita auth
router.put("/:id", auth.requerido, modificarUsuario);
router.delete("/:id", auth.requerido, eliminarUsuario);

module.exports = router;
