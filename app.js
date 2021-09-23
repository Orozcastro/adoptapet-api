const express = require("express"); //importar la biblioteca de express
const app = express(); // DEFINIR LA APP como objeto de EXPRESS | objeto en el que guardamos la API

// body parser, para interpretar como JSON, parsea el contenido del body
const bodyParser = require("body-parser"); // sirve para parsear
app.use(bodyParser.urlencoded({ extended: false })); // que no use esto por que ya no se usa
app.use(bodyParser.json()); //indicarle que vamos a usar el formato json

// CONFIGURACION DE LA BASE DE DATOS
const mongoose = require("mongoose");

// direccion que regreso atlas de mongodb
mongoose.connect(
  // "mongodb+srv://morozco:admin123@cluster0.azqnx.mongodb.net/Adoptpet?retryWrites=true&w=majority"
  process.env.MONGODB_URI, // obtiene la url de conexión desde las variables de entorno
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

// debugg, activa la funcion de debugueo para ver errores uqe pueda generar
mongoose.set("debug", true);

// para que reconozcqa los modelos antes de entrar a la ruta,
require("./models/Usuario");
require("./models/Mascota");
require("./models/Solicitud");

// para la autenticacion
require("./config/passport");

// RUTAS GRLOBALES
//Configurando las rutas
app.use("/v1", require("./routes"));
// http://localhost:4001/v1

// Iniciando el servidor
// Donde vamos a ejecutar nuestra app EN QUE PUERTO
// const PORT = 4001;
// escuchar todo lo que haga
// si llega una peticion HTTP reacciona a la peticion
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
// npm run dev para correr la app
// http://localhost:4001
// http://localhost:4001/v1

/* esto se restructuro en las carpetas

// simulacion de bd
const gods = {
  Zeus: { live: 'Olympus', symbol: 'Thunderbolt' }, 
  Hades : { live : 'Underworld', symbol: 'Cornucopia' } 
}

const constelaciones = [
     {Andromeda : {
        abreviatura : 'And',
        superficie :  722.3,
        num_estrellas : 152,
        estr_mas_brillante : 'Alpheratz' 
    }},
    {Centaurus : {
        abreviatura : 'Cen',
        superficie : 1060.4 ,
        num_estrellas : 281,
        estr_mas_brillante : 'Alfa Centauri' 
    }},
    {Hydra : {
        abreviatura : 'Hya',
        superficie : 1302.8 ,
        num_estrellas : 238,
        estr_mas_brillante : 'Alfard' 
    }},
    { Perseus: {
        abreviatura : 'Per',
        superficie : 615 ,
        num_estrellas : 158,
        estr_mas_brillante : 'Mirfak' 
    }},
    { Orion: {
        abreviatura : 'Ori',
        superficie : 594.1 ,
        num_estrellas : 204,
        estr_mas_brillante : 'Rigel' 
    }},
]


// SERVICIOS
//peticion get y su subdireccion, como se va a comportar(funcionalidad)
app.get('/gods', (req, res)=>{
    res.send(gods);
});

// rutas con parametros, sobre la url
app.get('/gods/:name', (req, res, next) => {
    const name = req.params.name;
    const good = gods[name];
    if (good) {
      res.send(good);
    } else {
      res.status(404).send('Good Not Found');
    }
});

// method POST  | http://localhost:4001/gods?name=Poseidon
// query string /gods?name=Zeus&id=34
app.post('/gods', (req, res)=>{
    let name = req.query.name; // recupero nombre de l nuevo dios
    let info = req.body; // recupero lo que se pasa en el body
    gods[name] = info; // lo asigno a mi objeto
    res.status(200).send(gods);
});

// method PUT
app.put('/gods/:name', (req, res, next) => {
    let god = req.params.name; //recuperar el nombre a modificar
    gods[god] = req.body;  //buscamos el dios a modificar y ponerle los nuevos valores
    res.send(gods)  //regresamos el objeto completo para ver las modificaciones
});

// method DELETE
app.delete('/gods/:name', (req, res)=>{
    let god = req.params.name;
    delete gods[god]
    res.send(gods);
});
  
//--------------------------------------------------------------------------------------------------
// reto 1: crear un get
app.get('/constelaciones', (req, res)=>{
    res.send(constelaciones);
})

// reto 2: servicios dinámicos de búsqueda

app.get('/constelaciones/:parametro', (req, res, next) => {
    const param = req.params.parametro;
    // function busqueda(param) {
    //     let 
    // }
    const good = gods[req.params.name];

    if (parametro) {
      res.send(parametro);
    } else {
      res.status(404).send('Good Not Found');
    }
});

*/
