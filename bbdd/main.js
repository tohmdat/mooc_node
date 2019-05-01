/*MÓDULO PRINCIPAL*/

//MODO LENGUAJE ESTRICTO---------------------------------------------------------------------------
'use strict'

//MÓDULOS IMPORTADOS-------------------------------------------------------------------------------
const readline = require('readline');
const {log, biglog, errorlog, colorize} = require("./out");
const cmds = require("./cmds");

// Mensaje inicial en letras grandes
biglog('CORE Quiz', 'green');
console.log();

//Función "readline" para procesar la entrada de y la salida a la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colorize('Quiz > ', 'blue'),
  completer: (line) => {
    const completions = 'help quit add list show test play delete edit credits'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    // show all completions if none found
    return [hits.length ? hits : completions, line];
  }
});

rl.prompt();

rl
.on('line', (line) => {

  let args = line.trim().split(" ");
  let cmd = args[0].toLowerCase().trim();

    switch (cmd) {
        case '':
            rl.prompt();
            break;

        case 'help':
        case 'h':
            cmds.helpCmd(rl);
            break;

        case 'quit':
        case 'q':
            cmds.quitCmd(rl);
            break;

        case 'add':
            cmds.addCmd(rl);
            break;

        case 'list':
            cmds.listCmd(rl);
            break;

        case 'show':
            cmds.showCmd(rl, args[1]);
            break;

        case 'test':
            cmds.testCmd(rl, args[1]);
            break;

        case 'play':
        case 'p':
            cmds.playCmd(rl);
            break;

        case 'delete':
            cmds.deleteCmd(rl, args[1]);
            break;

        case 'edit':
            cmds.editCmd(rl, args[1]);
            break;

        case 'credits':
            cmds.creditsCmd(rl);
            break;

        default:
            log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
            log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
            rl.prompt();
            break;
    }
})
.on('close', () => {
    log('Adios!');
    process.exit(0);
});