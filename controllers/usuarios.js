/*  Archivo controllers/usuarios.js
 *  Simulando la respuesta de objetos Usuario
 *  en un futuro aquí se utilizarán los modelos
 */

// CRUD
// importamos el modelo de usuarios
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const passport = require("passport");

function crearUsuario(req, res) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  const body = req.body,
    password = body.password; // la contraseña es la contraseña que el usuario registro en texto plano

  delete body.password; // quitar la contraseña del password

  // crear el usuario
  const usuario = new Usuario(body);
  usuario.crearPassword(password); // uso de la funcion crearPassword, se guarda el hash en la bd
  usuario
    .save()
    .then((user) => {
      //Guardando nuevo usuario en MongoDB.
      return res.status(201).json(user.toAuthJSON()); //toAuthJSON genera el token
    })
    .catch(next);
}

function obtenerUsuarios(req, res, next) {
  // Usuario.findById(req.usuario.id, (err, user) => { //se conoce el id username y pass, usuario se saca del auth cuando se autentifica userProperty usuario
  //   if (!user || err) {
  //     return res.sendStatus(401)
  //   }
  //   return res.json(user.publicData());
  // }).catch(next);
  Usuario.findById(req.usuario.id) //se conoce el id username y pass, usuario se saca del auth cuando se autentifica userProperty usuario
    .then((user) => {
      if (!user) {
        return res.sendStatus(401); //send status en caso de que no se auth
      }
      return res.json(user.publicData());
    })
    .catch(next);
}

function modificarUsuario(req, res, next) {
  console.log(req.usuario);
  // solo te puedes modificar a ti mismo
  Usuario.findById(req.usuario.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      let nuevaInfo = req.body;
      if (typeof nuevaInfo.username !== "undefined")
        user.username = nuevaInfo.username;
      if (typeof nuevaInfo.bio !== "undefined") user.bio = nuevaInfo.bio;
      if (typeof nuevaInfo.foto !== "undefined") user.foto = nuevaInfo.foto;
      if (typeof nuevaInfo.ubicacion !== "undefined")
        user.ubicacion = nuevaInfo.ubicacion;
      if (typeof nuevaInfo.telefono !== "undefined")
        user.telefono = nuevaInfo.telefono;
      if (typeof nuevaInfo.password !== "undefined")
        user.crearPassword(nuevaInfo.password);
      user
        .save()
        .then((updatedUser) => {
          //Guardando usuario modificado en MongoDB.
          res.status(201).json(updatedUser.publicData());
        })
        .catch(next);
    })
    .catch(next);
}

function eliminarUsuario(req, res, next) {
  // únicamente borra a su propio usuario obteniendo el id del token
  Usuario.findOneAndDelete({ _id: req.usuario.id })
    .then((r) => {
      //Buscando y eliminando usuario en MongoDB.
      res.status(200).send(`Usuario ${req.params.id} eliminado: ${r}`);
    })
    .catch(next);
}

function iniciarSesion(req, res, next) {
  if (!req.body.email || !req.body.password) {
    //si no recibe alguno de los dos no puede iniciar sesion
    //si no trae correo o contraseña
    return res.status(422).json({ errors: { email: "no puede estar vacío" } });
  }

  // iniciar sesion con authenticate
  // pasport manejo de sesiones
  passport.authenticate(
    "local", // estrategia local,
    { session: false }, // objeto sesion(solo se puede tener una sesion activa por eso false),
    function (err, user, info) {
      if (err) {
        return next(err);
      } // si hay error ve a la sig etapa

      if (user) {
        user.token = user.generarJWT(); //generale jwt al user si el user existe, el token anterior se borra
        // return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info); // si el user no esta autenticado por esta info de aqui
      }
    }
  )(req, res, next); //ejecuta la funcion que recibe estos parametros
}

// exportamos las funciones definidas
module.exports = {
  crearUsuario,
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  iniciarSesion,
};
