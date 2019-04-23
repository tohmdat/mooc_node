// Imports file system module
let fs = require("fs");

//Punto 2: Función que exportamos: elige al azar y muestra una frase
exports.quote_of_the_day = function () {

    //Generamos nº aleatorio entre 0 y 5 que son los índices del array de frases
    let aleatorio = Math.floor(Math.random()*5); 

    //Leemos el archivo json y elegimos una de las frases al azar
    fs.readFile(
        'mod4_quotes_of_the_day.json',
        'utf-8',
        function(err, data) { 
            let frases = JSON.parse(data);
            console.log(frases[aleatorio] + " (" + aleatorio + ")");
        }
    );

};