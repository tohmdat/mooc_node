/*MÓDULO PRINCIPAL*/

//MODO LENGUAJE ESTRICTO---------------------------------------------------------------------------
'use strict'

//MÓDULOS IMPORTADOS-------------------------------------------------------------------------------
const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require('./model'); //accedemos a sequelize con ./model, a la pdad model en concreto
const Sequelize = require('sequelize');

/**COMANDO AYUDA o HELP
 * @param rl Objeto readline usado para implementar el CLI
 **/
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


/**COMANDO LISTAR o LIST: Lista todos los quizzes existentes en el modelo
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.listCmd = rl => {

    models.quiz.findAll()
    .each( quiz => console.log(`[${colorize(quiz.id, 'magenta')}] ${quiz.question} => ${quiz.answer}`) )
    .catch( error => errorlog(`Ha surgido el siguiente error: ${error}`) )
    .then( () => rl.prompt() );
};


/**PROMESA PARA VALIDAR EL PARÁMETRO ID
 * 
 */
const validateId = id => {

    return new Sequelize.Promise( (resolve, reject) => {

        if (typeof id === "undefined") {
            reject ( new Error('Falta el parámetro id') );
        } else {
            let idn = parseInt(id,10); //Coger la parte entera y descartar lo demás
            if (Number.isNaN(idn)) {
                reject ( new Error('El valor del parámetro id no es un número') );
            } else {
                if (id - Math.floor(id) !== 0) {
                    reject ( new Error('El valor del parámetro id no es un número válido') );
                } else {
                    id= parseInt(id,10);
                    resolve(id); 
                }  
            }
        }

    });
};


/**COMANDO MOSTRAR o SHOW: Muestra el quiz indicado en el parámetro: la pregunta y la respuesta
 * @param rl Objeto readline usado para implementar el CLI
 * @param id Clave del quiz a mostrar
 */
exports.showCmd = (rl, id) => {

    validateId(id)
    .then(id => models.quiz.findByPk(id))
    .then(quiz => { 
        
        if (quiz===null) {    //(!quiz) otra forma de validar que no existe o es nulo
            throw new Error(`No existe el quiz nº [${id}] en la base de datos`);
        } else {
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`); 
        }

    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());

};


/**PROMESA PARA CREAR UNA PREGUNTA
 * 
 */
const makeQuestion = (rl, text) => {

    return new Sequelize.Promise( (resolve, reject) => {

        rl.question(colorize(text,'red'), answer => {
            resolve(answer.trim());
        });

    });
};


/**COMANDO AÑADIR o ADD: Añade un nuevo quiz al módelo
 * Pregunta interactivamente por la pregunta y por la respuesta
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario, es decir, 
 * la llamada a rl.prompt() se debe hacer en la callback de la segunda llamada a rl.question
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.addCmd = rl => {

    makeQuestion(rl, 'Introduzca una pregunta: ')
    .then(q => {
        return makeQuestion(rl, 'Introduzca la respuesta: ')
        .then(a => {
            return { question: q, answer: a};
        });
    })
    .then(quiz => {
        return models.quiz.create(quiz);
    })
    .then(quiz => {
        log(`${colorize('Se ha añadido el nuevo quiz', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());
    
};


/**COMANDO BORRAR o DELETE: Borra un quiz del modelo
 * @param rl Objeto readline usado para implementar el CLI
 * @param id Clave del quiz a borrar en el modelo
 */
exports.deleteCmd = (rl, id) => {

    validateId(id)
    .then(id => models.quiz.destroy( {where: {id} }))
    .then(n => {

        if (n!==0) { 
            log(`El quiz nº [${colorize(id, 'magenta')}] ha sido eliminado de la base de datos`);
        }
        else { 
            throw new Error(`El quiz nº [${id}] no existe en la base de datos`) 
        }
    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());
};


/**COMANDO EDITAR o EDIR: Edita un quiz del modelo
 * Hay que recordar que el funcionamiento de la funcion rl.question es asíncrono
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario, es decir, 
 * la llamada a rl.prompt() se debe hacer en la callback de la segunda llamada a rl.question
 * @param rl Objeto readline usado para implementar el CLI
 * @param id Clave del quiz a editar en el modelo
 */
exports.editCmd = (rl, id) => {

    validateId(id)
    .then(id => models.quiz.findByPk(id))
    .then(quiz => {

        if (quiz===null) { 
            throw new Error(`No existe el quiz nº [${id}] en la base de datos`);
        } 

        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
        return makeQuestion(rl, 'Introduzca una pregunta: ')
        .then(q => {
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
            return makeQuestion(rl, 'Introduzca la respuesta: ')
            .then(a => {
                quiz.question = q;
                quiz.answer = a;
                return quiz;
            });
        });
 
    })
    .then((quiz) => {
        return quiz.save();
    })
    .then(quiz => {
        log(`Se ha cambiado el quiz [${colorize(id, 'magenta')}] por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());

};


/**COMANDO PROBAR o TEST: Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar
 * @param rl Objeto readline usado para implementar el CLI
 * @param id Clave del quiz a probar
 */
exports.testCmd = (rl,id) => {

    validateId(id)
    .then(id => models.quiz.findByPk(id))
    .then(quiz => {

        if (quiz===null) { 
            throw new Error(`No existe el quiz nº [${id}] en la base de datos`);
        } 

        log('Este es un test: Contesta a la siguiente pregunta', 'magenta');
        return makeQuestion(rl, `${colorize(quiz.question)}: `)
        .then(a => {

            if (a.toLowerCase().trim()===quiz.answer.toLowerCase()) { 
                console.log();
                log('La respuesta es:', 'magenta');
                biglog('CORRECTA', 'green');
            } else {
                console.log();
                log('La respuesta es: ', 'magenta');
                biglog('INCORRECTA', 'red');
            }

        })
    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());

};


/**PROMESA PARA SACAR UN ARRAY CON LOS QUIZZES DE LA TABLA "QUIZZES"**/
const getAllQuizzes = () => {

    return new Sequelize.Promise( (resolve, reject) => {

        let n = 0;
        let array = [];
        let objeto = new Object;

        models.quiz.findAll()
        .each( quiz => { 

            n++; //La variable "n" va iterando de 1 al nº total de objetos
            let id = quiz.id;              //Definimos las
            let question = quiz.question;  //variables del
            let answer = quiz.answer;      //objeto
            
            objeto = {/*n,*/id,question,answer}; //Definimos el objeto de cada iteración
            array.push(objeto);     //Creamos un array ordenado con el parámetro "n"

            models.quiz.count()
            .then(c => {
                if (n===c) { resolve(array) }
            });
        });

        if (!array) {
            reject(new Error('No existe un array'))
        }
    });

};


/**COMANDO JUGAR o PLAY: Pregunta todos los quizzes existentes en el modelo en orden aleatorio
 * Se gana si se contesta a todos satisfactoriamente
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.playCmd = rl => {

    getAllQuizzes()
    .then(quizzes => {

        if (!quizzes) { throw new Error(`No existen quizzes en la base de datos`); } 

        console.log(quizzes);
        let score = 0; //Variable que acumulará las respuestas correctas

        return models.quiz.count()
        .then(count => {

            const nextQuestion = () => {

                let azarId = (Math.floor(Math.random()*count)); //Generamos al azar el índice de un quizz
                let quiz = quizzes[azarId]; 

                return makeQuestion(rl, `${colorize(quiz.question)}: `)
                .then(answer => {

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
                            return nextQuestion();
                        } else {
                            console.log();
                            log(`El juego finalizó. Aciertos totales: ${score}`, 'magenta');
                            biglog(`${score}`, 'magenta');
                        }
                    } else {
                        console.log();
                        log('La respuesta es: ', 'magenta');
                        biglog('INCORRECTA', 'red');
                        console.log();
                        log(`Aciertos totales: ${score}`, 'magenta');
                        biglog(`${score}`, 'magenta');
                    }
                })

            };
    

            if (count>0) { 
                console.log();
                log('Responde pregunta tras pregunta hasta que falles', 'magenta');
                console.log();
                return nextQuestion();
            } else { 
                console.log(No);
                console.log(count);
                throw new Error('No hay preguntas');
            }
        });

    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erróneo');
        error.errors.forEach(({message}) => errorlog(message));
    })
    .catch(error => errorlog(`Ha surgido el siguiente error: ${error}`))
    .then(() => rl.prompt());

};


/**COMANDO AUTOR o CREDITS: Muestra los nombres de los autores de la práctica
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.creditsCmd = rl => {
    log('Autor de la práctica:');
    log('Tomás De Anta Tejado', 'green');
    rl.prompt();
};


/**COMANDO ABANDONAR o QUIT: Terminar el programa
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
    rl.close();
};

