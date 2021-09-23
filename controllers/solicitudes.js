const mongoose = require("mongoose");
const Solicitud = mongoose.model("Solicitud");

//     C R U D
function obtenerSolicitud(req, res, next) {
  if (req.params.id) {
    Solicitud.findById(req.params.id)
      .then((sol) => {
        res.send(sol);
      })
      .catch(next);
  } else {
    Solicitud.find()
      .then((solicitudes) => {
        res.send(solicitudes);
      })
      .catch(next);
  }
}

function crearSolicitud(req, res, next) {
  let solicitud = new Solicitud(req.body);
  solicitud
    .save()
    .then((solicitud) => {
      res.status(200).send(solicitud);
    })
    .catch(next);
}
function modificarSolicitud(req, res, next) {
  Solicitud.findById(req.params.id)
    .then((solicitud) => {
      if (!solicitud) {
        return res.sendStatus(401);
      }
      //recuperar la info que el usuario pidio que modificara
      let nuevaInfo = req.body;
      if (typeof nuevaInfo.idMascota !== "undefined")
        solicitud.idMascota = nuevaInfo.idMascota;
      if (typeof nuevaInfo.fechaDeCreacion !== "undefined")
        solicitud.fechaDeCreacion = nuevaInfo.fechaDeCreacion;
      if (typeof nuevaInfo.idUsuarioAnunciante !== "undefined")
        solicitud.idUsuarioAnunciante = nuevaInfo.idUsuarioAnunciante;
      if (typeof nuevaInfo.idUsuarioSolicitante !== "undefined")
        solicitud.idUsuarioSolicitante = nuevaInfo.idUsuarioSolicitante;
      if (typeof nuevaInfo.estado !== "undefined")
        solicitud.estado = nuevaInfo.estado;
      solicitud
        .save()
        .then((updated) => {
          res.status(200).json(updated.publicData());
        })
        .catch(next);
    })
    .catch(next);
}

function eliminarSolicitud(req, res, next) {
  Solicitud.findOneAndDelete({ _id: req.params.id })
    .then((r) => {
      res.status(200).send(`Solicitud ${req.params.id} eliminada: ${r}`);
    })
    .catch(next);
}

function count(req, res, next) {
  let idMascota = req.params.id;
  Solicitud.aggregate([
    { $match: { idMascota: idMascota } },
    { $count: "total" },
  ])
    .then((r) => {
      res.status(200).send(r);
    })
    .catch(next);
}

module.exports = {
  obtenerSolicitud,
  crearSolicitud,
  modificarSolicitud,
  eliminarSolicitud,
  count,
};
