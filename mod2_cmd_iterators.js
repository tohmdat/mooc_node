/*PUNTO 0*///Multiasignación
let [a,b,...array_0] = process.argv;

/*PUNTO 1*/
console.log(); //Línea en blanco

//Ruta al interprete de node.js
console.log(`Route to node.js: ${a}` );

//Ruta al fichero mod2_cmd_iterators.js (que contiene el programa)
console.log(`Route to this file: ${b}` );

console.log(); //Línea en blanco

/*PUNTO 2*/
//Iteramos el array y comprobamos si algún parámetro es "-r" para eliminar "-r" y el siguiente
array_0.forEach((elem, i) => {
  if (elem==="-r") { 
    array_0.splice(i,2);
  }
});

//Al array process.arg resultante le pasamos el método sort() para ordenarlo alfabéticamente
array_0.sort();

//Al resultado le pasamos un método reduce para eliminar los redundantes
let array_1 = array_0.reduce((ac, el, i, a) => el!==a[i-1] ? ac.concat(el) : ac, []);

//Al resultado le pasamos el método forEach() para iterarlos y contarlos con un método reduce
array_1.forEach((elem, i) => {
  let cont = array_0.reduce((ac, el, i, a) => el===elem ? ++ac : ac, 0);
  console.log(`${elem} : ${cont}`);
});

/*PUNTO 3*///Finaliza el programa
