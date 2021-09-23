// modelado de autentificacion te dejo o no te dejo pasar
const jwt = require("express-jwt");
const secret = require("../config").secret; //genera jwt

// header info de configuracion
// Obtenemos el jwt del header de la petición y verificamos su existencia.
function getTokenFromHeader(req) {
  // encontrar el jwt que mando el user en el request
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") || //separar la autorizacion del header y buscar token, split genera un arreglo
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    //o buscar por bearer
    return req.headers.authorization.split(" ")[1]; // verificar que lo que mandaron es correcto
  }

  return null; // no venia la autenticacion
}

// construir json de autenticacion, servicio que requiere autentiacion o servicio publico
// necesita el jwt o es opcional
const auth = {
  requerido: jwt({
    //servicio privado
    secret: secret,
    algorithms: ["HS256"],
    userProperty: "usuario", //se trata de los uusrios
    getToken: getTokenFromHeader, //forma de acceder al token //pasa la funcion como parametro
  }),
  opcional: jwt({
    // servicio publico
    secret: secret,
    algorithms: ["HS256"],
    userProperty: "usuario",
    credentialsRequired: false, //por default es true
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
