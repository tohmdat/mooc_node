// Import module "express"
const express = require('express');
const app = express();

// Import MW for parsing POST params in BODY
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import MW supporting Method Override with express
const methodOverride = require('method-override');
app.use(methodOverride('_method', {methods: ["POST", "GET"]}));


// MODEL
const Sequelize = require('sequelize');

const options = { logging: false/*, operatorsAliases: false*/};
const sequelize = new Sequelize("sqlite:db.sqlite", options);

const quizzes = sequelize.define(  // define table quizzes
    'quizzes',     
    {   question: Sequelize.STRING,
        answer: Sequelize.STRING
    }
);

sequelize.sync() // Syncronize DB and seed if needed
.then(() => quizzes.count())
.then((count) => {
    if (count===0) {
        return ( 
            quizzes.bulkCreate([
                { id: 1, question: "Capital of Italy",    answer: "Rome" },
                { id: 2, question: "Capital of France",   answer: "Paris" },
                { id: 3, question: "Capital of Spain",    answer: "Madrid" },
                { id: 4, question: "Capital of Portugal", answer: "Lisbon" }
            ])
            .then( c => console.log(`  DB created with ${c.length} elems`))
        )
    } else {
        return console.log(`  DB exists & has ${count} elems`);
    }
})
.catch( err => console.log(`   ${err}`));


// VIEWs
const index = (quizzes) => `<!-- HTML view -->
<html>
    <head><title>MVC Example</title><meta charset="utf-8"></head> 
    <body> 
        <h1>MVC: Quizzes</h1>
        <table>`
+ quizzes.reduce(
    (ac, quiz) => ac += 
        `<tr>
        <td><a href="/quizzes/${quiz.id}/play">${quiz.question}</a></td>
        <td><a href="/quizzes/${quiz.id}/edit"><button>Edit</button></a></td>
        <td><a href="/quizzes/${quiz.id}?_method=DELETE"
           onClick="return confirm('Delete this quiz?: ${quiz.question}')">
           <button>Delete</button></a></td></tr>`, 
    ""
)
+ `     </table>
        <p/>
        <a href="/quizzes/new"><button>New Quiz</button></a>
    </body>
</html>`;

const play = (id, questionORmessage, response) => `<!-- HTML view -->
<html>
    <head><title>MVC Example</title><meta charset="utf-8">
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js" > </script>
    <script type="text/javascript">
        $(function(){
            $('#submit').on('click', function(){
                $.ajax({ type:'GET',
                         url: '/quizzes/id/check?response=' + $('#response').value(),
                         success: function(msg){ $('#msg').html(msg); }
                });
                $('#form').show();
                $('#msg').hide();
            });

            
            $('#form').show();
            $('#msg').hide();
        });
    </script>
    </head> 
    <body>
        <h1>MVC: Quizzes</h1>
        <form method="get" action="/quizzes/${id}/check">
            <p id="form">${questionORmessage}: </p>
            <input id="response" type="text" name="response" value="${response}" placeholder="Answer" />
            <input type="submit" value="Check"/> <br>
        </form>
        
        <div id="msg"></div>

        </p>
        <a href="/quizzes"><button>Go back</button></a>
    </body>
</html>`;


       // <strong><div id="msg">${msg}</div></strong>


const quizForm =(msg, method, action, question, answer) => `<!-- HTML view -->
<html>
    <head><title>MVC Example</title><meta charset="utf-8"></head> 
    <body>
        <h1>MVC: Quizzes</h1>
        <form  method="${method}" action="${action}">
            ${msg}: <p>
            <input  type="text"  name="question" value="${question}" placeholder="Question" />
            <input  type="text"  name="answer"   value="${answer}"   placeholder="Answer" />
            <input  type="submit" value="Create/Edit"/> <br>
        </form>
        </p>
        <a href="/quizzes"><button>Go back</button></a>
    </body>
</html>`;


// CONTROLLER
// GET /, GET /quizzes
const indexController = (req, res, next) => {
 
    quizzes.findAll()
    .then((quizzes) => res.send(index(quizzes)))
    .catch((error) => `DB Error:\n${error}`);
}

//  GET  /quizzes/1/play
const playController = (req, res, next) => {
    let id = Number(req.params.id);
    let response = req.query.response || "";

    quizzes.findByPk(id)
    .then((quiz) => res.send(play(id, quiz.question, response)))
    .catch((error) => `A DB Error has occurred:\n${error}`);
 };

//  GET  /quizzes/1/check
const checkController = (req, res, next) => {
    let response = req.query.response, msg;
    let id = Number(req.params.id);

    quizzes.findByPk(id)
    .then((quiz) => {
        msg = (quiz.answer===response) ?
              `Yes, "${response}" is the ${quiz.question}` 
            : `No, "${response}" is not the ${quiz.question}`;
        return res.send(msg);
    })
    .catch((error) => `A DB Error has occurred:\n${error}`);
};

//  GET /quizzes/1/edit
const editController = (req, res, next) => {
    let id = Number(req.params.id);

    quizzes.findByPk(id)
    .then((quiz) => res.send(quizForm("Edit the Quiz", "post", `/quizzes/${id}?_method=PUT`, quiz.question, quiz.answer)))
    .catch((error) => `A DB Error has occurred:\n${error}`);
};

//  PUT /quizzes/1
const updateController = (req, res, next) => {
    let id = Number(req.params.id);
    let question = req.body.question;
    let answer =  req.body.answer;

    quizzes.update( {question,answer}, {where: {id}})
    .then( n => {
    if (n[0]!==0) { res.redirect('/quizzes') }
    else { throw new Error(`The Quiz ${id} not in DB`) };
    })
    .catch( err => console.log(`${err}`));
};

// GET /quizzes/new
const newController = (req, res, next) => {

    res.send(quizForm("Create new Quiz", "post", "/quizzes", "", ""));
 };

// POST /quizzes
const createController = (req, res, next) => {
    let {question, answer} = req.body;

    quizzes.build({question, answer})
    .save()
    .then((quiz) => res.redirect('/quizzes'))
    .catch((error) => `Quiz not created:\n${error}`);
 };

// DELETE /quizzes/1
const destroyController = (req, res, next) => {
    let id = Number(req.params.id);

    quizzes.destroy( {where: {id}} )
    .then( n => {
    if (n!==0) { res.redirect('/quizzes') }
    else { throw new Error(`The Quiz ${id} not in DB`) };
    })
    .catch( err => console.log(`${err}`));
 };



// ROUTER
app.get(['/', '/quizzes'],    indexController);
app.get('/quizzes/:id/play',  playController);
app.get('/quizzes/:id/check', checkController);
app.get('/quizzes/new',       newController);
app.post('/quizzes',          createController);
app.get('/quizzes/:id/edit',  editController);
app.put('/quizzes/:id',       updateController);
app.delete('/quizzes/:id',    destroyController);

app.all('*', (req, res) =>
    res.send("Error: resource not found or method not supported")
);        


// Server started at port 8000
app.listen(8000);

