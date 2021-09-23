// const Mascota = require("../models/Mascota");
// conection a la base de datos
// importar mongoose
const mongoose = require("mongoose");
// definir la constante mascota de mongoose
const Mascota = mongoose.model("Mascota");

//     C R U D
function crearMascota(req, res, next) {
  let mascota = new Mascota(req.body);
  mascota
    .save() //save, funcion que guarda en la BD, la mascota que creo la guarda en la BD con la info que manda el usuario en el body
    .then((pet) => {
      res.status(200).send(pet);
    })
    .catch(next);
}

function obtenerMascotas(req, res, next) {
  // Simulando dos usuarios y respondiendolos
  //   var mascota1 = new Mascota(
  //     1,
  //     "Tobi",
  //     "perro",
  //     "https://petstore/photo-tobi",
  //     "Es muy tranquilo",
  //     "Juan",
  //     "Jalisco"
  //   );
  //   res.send([mascota1, mascota2]);
  if (req.params.id) {
    Mascota.findById(req.params.id)
      .then((pet) => {
        res.send(pet);
      })
      .catch(next);
  } else {
    //si no se manda un id, find manda todas las mascotas
    Mascota.find()
      .then((mascotas) => {
        res.send(mascotas);
      })
      .catch(next);
  }
}

function modificarMascota(req, res, next) {
  // simulando un usuario previamente existente que el cliente modifica
  //   let mascota1 = new Mascota(
  //     req.params.id,
  //     "Firulais",
  //     "perro",
  //     "https://petstore/photo-tobi",
  //     "Tiene manchas negras",
  //     "dany",
  //     "guanajuato"
  //   );
  //   let modificaciones = req.body;
  //   mascota1 = { ...usuario1, ...modificaciones };
  //   res.send(mascota1);
  Mascota.findById(req.params.id)
    //   mascota recupera la mascota con el id especifico que busco
    .then((mascota) => {
      // si no encuentra la mascota que esta piediendo el usuario
      if (!mascota) {
        return res.sendStatus(401);
      }
      //recuperar la info que el usuario pidio que modificara
      let nuevaInfo = req.body;
      if (typeof nuevaInfo.nombre !== "undefined")
        mascota.nombre = nuevaInfo.nombre;
      if (typeof nuevaInfo.categoria !== "undefined")
        mascota.categoria = nuevaInfo.categoria;
      if (typeof nuevaInfo.fotos !== "undefined")
        mascota.fotos = nuevaInfo.fotos;
      if (typeof nuevaInfo.descripcion !== "undefined")
        mascota.descripcion = nuevaInfo.descripcion;
      if (typeof nuevaInfo.anunciante !== "undefined")
        mascota.anunciante = nuevaInfo.anunciante;
      if (typeof nuevaInfo.ubicacion !== "undefined")
        mascota.ubicacion = nuevaInfo.ubicacion;
      mascota
        .save() //cuardar los cambios en la bd de mascota
        .then((updated) => {
          res.status(200).json(updated.publicData());
        })
        .catch(next);
    })
    .catch(next);
}

function eliminarMascota(req, res, next) {
  //   res.status(200).send(`Mascota ${req.params.id} eliminado`);
  Mascota.findOneAndDelete({ _id: req.params.id }).then((r) => {
    res.status(200).send(`Mascota ${req.params.id} eliminada: ${r}`);
  });
}

// agregacion con mongoose
function count(req, res, next) {
  var categoria = req.params.cat;
  // aggregate ejecuta una agregacion
  // el agregate se pasa como parametro
  Mascota.aggregate([
    {
      $match: {
        categoria: categoria,
      },
    },
    {
      $count: "total",
    },
  ])
    .then((r) => {
      res.status(200).send(r);
    })
    .catch(next);
}

// exportamos las funciones definidas
module.exports = {
  crearMascota,
  obtenerMascotas,
  modificarMascota,
  eliminarMascota,
  count,
};
