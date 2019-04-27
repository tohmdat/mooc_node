

const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');


/**
 * Muestra la ayuda.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.helpCmd = rl => {
    log("Commandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz indicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};


/**
 * Lista todos los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        log(` [${colorize(id, 'magenta')}]:  ${quiz.question}`);
    });
    rl.prompt();
};


/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a mostrar.
 */
exports.showCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Añade un nuevo quiz al módelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};


/**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};


/**
 * Edita un quiz del modelo.
 *
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */
exports.testCmd = (rl,id) => {
    console.log();

    if (typeof id === "undefined") {
        errorlog('Falta el parámetro id');
        console.log();
        rl.prompt();

    } else {
        try {
            const quiz = model.getByIndex(id);

            log('Este es un test: Contesta a la siguiente pregunta', 'magenta');
            console.log();

            rl.question(`${colorize(quiz.question, 'yellow')}: `, answer => {

                if (answer.toLowerCase().trim()===quiz.answer.toLowerCase()) { 
                    console.log();
                    log('La respuesta es:', 'magenta');
                    biglog('CORRECTA', 'green');
                } else {
                    console.log();
                    log('La respuesta es: ', 'magenta');
                    biglog('INCORRECTA', 'red');
                }
                console.log();
                rl.prompt();
            });

        } catch (error) {
            errorlog(error.message);
            console.log();
            rl.prompt();
        };
    };
};


/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.playCmd = rl => {

    let quizzes = model.getAll(); //Obtenemos un array con todos los quizzes
    let count = model.count(); //Obtenemos el nº total de quizzes que hay almacenados
    let score = 0; //Variable que acumulará las respuestas correctas

    const nextQuestion = () => {

        let azarId = (Math.floor(Math.random()*count)); //Generamos al azar el índice de un quizz
        let quiz = quizzes[azarId]; 
        
        rl.question(`${colorize(quiz.question, 'yellow')}: `, answer => {

            if (answer.toLowerCase().trim()===quiz.answer.toLowerCase()) { 
                console.log();
                log('La respuesta es:', 'magenta');
                biglog('CORRECTA', 'green');
                score++;
                quizzes.splice(azarId, 1);
                count--;
                if (count!==0) { 
                    console.log();
                    console.log(`Aciertos: ${score}`);
                    console.log();
                    nextQuestion();
                } else {
                    console.log();
                    log(`El juego finalizó. Aciertos totales: ${score}`, 'magenta');
                    biglog(`${score}`, 'magenta');
                    console.log();
                    rl.prompt();
                }
            } else {
                console.log();
                log('La respuesta es: ', 'magenta');
                biglog('INCORRECTA', 'red');
                console.log();
                log(`Aciertos totales: ${score}`, 'magenta');
                biglog(`${score}`, 'magenta');
                console.log();
                rl.prompt();
            }
        });
    };

    if (count>0) { 
        console.log();
        log('Responde pregunta tras pregunta hasta que falles', 'magenta');
        console.log();
        nextQuestion();
    } else { 
        console.log();
        log('No hay preguntas', 'magenta');
        console.log();
        rl.prompt();
    }
};


/**
 * Muestra los nombres de los autores de la práctica.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.creditsCmd = rl => {
    log('Autores de la práctica:');
    log('Tomás De Anta Tejado', 'green');
    rl.prompt();
};


/**
 * Terminar el programa.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};

