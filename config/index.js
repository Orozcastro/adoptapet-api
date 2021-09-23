/*** info general de la configuracion */
// variable secret para configurar , llave para calcular el jwt
module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "secret",
};
