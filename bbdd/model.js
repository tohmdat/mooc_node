/*MÓDULO DE BASE DE DATOS*/

//MODO LENGUAJE ESTRICTO---------------------------------------------------------------------------
'use strict'

//MÓDULOS IMPORTADOS-------------------------------------------------------------------------------
//En este caso definimos el constructor "Sequelize" como ORM de BBDD
const Sequelize = require('sequelize');

//ALMACÉN DE DATOS---------------------------------------------------------------------------------
//Definimos la base de datos sqlite y unas opciones
const sequelize = new Sequelize("sqlite:db.sqlite", {logging: false});


//Definimos el contenido o tablas de la BBDD: en este caso la tabla "quizzes"
sequelize.define('quiz', { 
    question: { 
        type: Sequelize.STRING,
        unique: { msg: "El quiz ya existe"},
        validate: { notEmpty: { msg: "La pregunta no puede estar vacía" } }
    },
    answer: {
        type: Sequelize.STRING,
        validate: { notEmpty: { msg: "La respuesta no puede estar vacía" } }
    }
});


//Inicializamos la base de datos con las primeras preguntas
sequelize.sync()
.then(() => sequelize.models.quiz.count())
.then((count) => {
    if (count===0) {
        return sequelize.models.quiz.bulkCreate([
        { question: "Capital de Italia", answer: "Roma" },
        { question: "Capital de Francia", answer: "París" },
        { question: "Capital de España", answer: "Madrid" },
        { question: "Capital de Portugal", answer: "Lisboa" }
        ])
    }
})
.catch( error => console.log(`Ha surgido el siguiente error: ${error}`));


//Exportamos el  objeto de acceso ORM a la BBDD creada
module.exports = sequelize;