/** Clase que representa un animalito a adoptar */
// class Mascota {
//     constructor(id, nombre, categoria, fotos, descripcion, anunciante, ubicacion) {
//       this.id = id;
//       this.nombre = nombre; // nombre de la mascota (o titulo del anuncio)
//       this.categoria = categoria; // perro | gato | otro
//       this.fotos = fotos; // links a las fotografías
//       this.descripcion = descripcion; // descripción del anuncio
//       this.anunciante = anunciante; // contacto con la persona que anuncia al animalito
//       this.ubicacion = ubicacion; // muy importante
//     }

//   }

//   module.exports = Mascota;

// importar mongoose
const mongoose = require("mongoose");

// esquema, recibe obj con todos los atributos, la info que identificamos para  los usuarios
// representacion por el lado de jS  de cada modelo
const MascotaSchema = new mongoose.Schema(
  {
    // definir campo(atributo) y el tipo de dato
    nombre: { type: String, required: true }, // nombre de la mascota (o titulo del anuncio)
    categoria: { type: String, enum: ["Perro", "Gato", "Otro"] }, // perro | gato | otro , enum(el cuál nos permite pasar únicamente los valores 'perro', 'gato' u 'otro'.)
    fotos: [String], // links a las fotografías
    descripcion: { type: String, required: true }, // descripción del anuncio
    anunciante: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }, // contacto con la persona que anuncia al animalito, crearemos una referencia el modelo Usuario(esquema) que contendrá el id de un usuario y nos servirá más adelante.
    ubicacion: { type: String }, // muy importante
    // estado: { type: String, enum: ["adoptado", "disponible", "pendiente"] },
  },
  {
    collection: "Mascotas", //(la colleccion ala que apunta)EL ESQUEMA, dentro de la Base de datos apunta a la coleccion de usuarios
    timestamps: true,
  }
); //(guarda la fecha de cuandos e crea cada user)guarda la fecha de la ultima modificacion o se van creando nuevos documentos

// indica cuales campos son publicos, funcion que regresa la info publica del esquema indicado
// permite acceder a la info, para proteger la info del esquema se especifica que info puede ser publica
// como encapsulamiento de datos

MascotaSchema.methods.publicData = () => {
  return {
    id: this.id,
    nombre: this.nombre,
    categoria: this.categoria,
    fotos: this.fotos,
    descripcion: this.descripcion,
    anunciante: this.anunciante,
    ubicacion: this.ubicacion,
    // estado: this.estado
  };
};

// definimos la correspondencia entre la colección Usuario y el schema UsuarioSchema
// cada que se hable de usuario, la funcionalidad la encuentra en usuario esquema
// Usuario de modelo(siempre con mayuscula)
mongoose.model("Mascota", MascotaSchema);
