/*PUNTO 1*///Línea en blanco
console.log();

/*PUNTO 2*///Saludo según la hora del día
let hourDay = new Date().getHours(); //Se define variable para almacenar la hora
let greetDay = "night"; //Se establece en ua variable el saludo predeterminado "night"

if (hourDay>7 && hourDay<=12) { greetDay = "morning" }  //Condicional para evaluar si la hora del día es de mañana
else if (hourDay>12 && hourDay<22) { greetDay = "afternoon" } //o esde tarde

console.log(`"Good ${greetDay}, it's ${hourDay} o'clock"`); //Se muestra el saludo 

/*PUNTO 3*///Línea en blanco
console.log();

/*PUNTO 4*///Número PI con seis decimales
console.log(`Number PI with 6 decimals: ${(Math.PI).toFixed(6)}`); 

/*PUNTO 5*///Línea en blanco
console.log();

/*PUNTO 6*///Tabla del 0 al 22 con números en decimal, hexadecimal, octal y binario
//Función que escribe en todos los sistemas el número pasado en el argumento d
function numeros (d) { console.log(`${d} dec = ${(d).toString(16)} hex = ${(d).toString(8)} oct = ${(d).toString(2)} bin`) };

for (i=0; i<=22; i++) { numeros(i); } //Bucle for para iterar los números del 1 al 22

/*PUNTO 7*///Línea en blanco
console.log();

/*PUNTO 8*///Tabla con números en decimal, hexadecimal, octal y binario con los impares del 1 al 21 excepto los del intervalo 10-20
for (i=0; i<=22; i++) { 
  if (i%2 && (i<10 || i>20)) { numeros(i); } //Añadimos al bucle del punto 6 un condicional para excluir pares y números del 10 al 20
} 

/*PUNTO 9*///Línea en blanco
console.log();

/*PUNTO 10*///Frase en chino con caracteres escapados
console.log("Hi in Chinese is written as: \u55e8\uff0c\u4f60\u597d\u5417");

/*PUNTO 11*///Línea en blanco
console.log();

/*PUNTO 12*///Línea final
console.log("The program has finished");