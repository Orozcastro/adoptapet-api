const passport = require("passport"); //Importando passport, middleware para autenticación.
const LocalStrategy = require("passport-local").Strategy; //Importando estrategia autenticación. --> passport-local
const mongoose = require("mongoose"); // pasa saber 2quien tiene permiso para que cosa
const Usuario = mongoose.model("Usuario"); // saber que usuario esta intentando acceder al servicio, uso del modelo usuario

// configulacion proceso de loggin
passport.use(
  new LocalStrategy(
    {
      //construir un strategy, recibe json con email y password            //Configurando elementos utilizados para habilitar sesión.
      usernameField: "email", // campos para saber porque se va a loggear(como estan guardados en la bd)
      passwordField: "password", // identificadores
    },
    function (email, password, next) {
      //modela el proceso de autenfificacion
      Usuario.findOne({ email: email }) //encontrar un usuario con el email que recibe, consulta a la bd, retorna un usuario
        .then(function (user) {
          // recibe el usuario que encontro en la bd
          if (!user || !user.validarPassword(password)) {
            //si el usuario no existe o la contraseña no es valida
            return next(null, false, {
              errors: { "email o contraseña": "equivocado(a)" },
            }); // regresa null(info adicional del proceso de login) y false, el error se puede mostrar en el front
          }
          return next(null, user); // aqui si tiene acceso a la info del usuario
        })
        .catch(next);
    }
  )
);

/** localstrategy retorna un json 
 {
  "email": "yo@juanitovega.com",
  "password": "mipassword"
}*/
