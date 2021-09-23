/** Clase que representa a un usuario de la plataforma*/
// class Usuario {
//     constructor(id, username, nombre, apellido, email, password, tipo) {
//       this.id = id;
//       this.username = username;
//       this.nombre = nombre;
//       this.apellido = apellido;
//       this.email = email;
//       this.password = password;
//       this.tipo = tipo; // tipo normal o anunciante
//     }
//   }
//   module.exports = Usuario;

// importar mongoose
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); //valida que los campos que tienen unique sean unicos
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const { parse } = require("path");

// esquema, recibe obj con todos los atributos, la info que identificamos para  los usuarios
// representacion por el lado de jS  de cada modelo
const UsuarioSchema = new mongoose.Schema(
  {
    // definir campo(atributo) y el tipo de dato
    username: {
      type: String,
      unique: true, //este campo no se puede repetir
      lowercase: true,
      required: [true, "no puede estar vacío"], // se puede mandar un mensaje de error, lo manda al front
      match: [/^[a-zA-Z0-9]+$/, "es inválido"], //restriccion match, caracter de la a-z o 0-9 al menos uno pero tantos como quieras
      index: true,
    },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: {
      type: String,
      unique: true, //este campo no se puede repetir
      lowercase: true,
      required: [true, "no puede estar vacío"],
      match: [/\S+@\S+\.\S+/, "es inválido"],
      index: true,
    },
    tipo: { type: String, enum: ["normal", "anunciante"] },
    // password: String, se sustituye por hash y salt
    hash: String, //este campo se utilizará para la sesión, texto cifrado
    salt: String, //este campo se utilizará para la sesión, semilla
  },
  {
    collection: "Usuarios", //(la colleccion ala que apunta)EL ESQUEMA, dentro de la Base de datos apunta a la coleccion de usuarios
    timestamps: true,
  }
); //(guarda la fecha de cuandos e crea cada user)guarda la fecha de la ultima modificacion o se van creando nuevos documentos

// unique validator, valida que los campos que tienen unique sean unicos
UsuarioSchema.plugin(uniqueValidator, { message: "Ya existe" });

// indica cuales campos son publicos, funcion que regresa la info publica del esquema indicado
// permite acceder a la info, para proteger la info del esquema se especifica que info puede ser publica
// como encapsulamiento de datos

UsuarioSchema.methods.publicData = function () {
  return {
    id: this.id,
    username: this.username,
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    tipo: this.tipo,
  };
};

// crea la contraseña cifrada que se guarda en la bd
// todo esto se ejecuta directamente en el servidor
UsuarioSchema.methods.crearPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex"); // semilla definir una cadena de forma aleatoria en hexadecimal
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512") //funcion de cifrado, recibe texto plano y luego la semilla, hace 10000 iteraciones, 512 caracteres, tipo de cifrado
    .toString("hex"); //se convierte a cadena hexadecimal
};

// validar el password,
UsuarioSchema.methods.validarPassword = function (password) {
  // lo que se tiene en newhash(lo que dio el usuario) se compara con la cifrada que se guardo en la base de datos
  const newHash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === newHash; //
};

// generar un jwt con expiracion de 60dias
UsuarioSchema.methods.generaJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60); //en 60 dias expita

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  ); // firmar un token
};

// to auth json, JSON DE AUTENTIFICACION convierte el jwt
// json de la respuesta al usuario cada que inicie sesion
UsuarioSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generarJWT(), //
  };
};

// definimos la correspondencia entre la colección Usuario y el schema UsuarioSchema
// cada que se hable de usuario, la funcionalidad la encuentra en usuario esquema
// Usuario de modelo(siempre con mayuscula)
mongoose.model("Usuario", UsuarioSchema);
