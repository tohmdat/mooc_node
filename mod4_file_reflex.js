'use strict'

// Imports user module mod4-quote_of_the_day.js
let my_mod = require("./mod4_quote_of_the_day.js");

// Imports file system module
//let fs = require("fs");


//PARTE 1: CITA DEL DÍA
//Línea en blanco
console.log();

//Punto 2: Título y llamada a la función "quote_of_the_day"
console.log("Quote of the day:");
my_mod.quote_of_the_day();


//PARTE 2: REFLEJOS
let delay = ((Math.ceil(Math.random()*5))*1000).toFixed(0);
setTimeout(reflexes, delay);

function reflexes() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '\nPress return: '
    });

    rl.prompt();
    let now1 = Date.now();

    rl.on('line', () => { 
        let now2 = Date.now();
        console.log("Your time is: " + (now2-now1)  + "ms "); 
        process.exit(0);
    });
};

