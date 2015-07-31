var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// sqlite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dbName   = url[6] || null;
var user     = url[2] || null;
var password = url[3] || null;
var protocol = url[1] || null;
var port     = url[5] || null;
var host     = url[4] || null;

var storage  = process.env.DATABASE_STORAGE;

// Carga sequelize
var Sequelize = require('sequelize');

var sequelize = new Sequelize(dbName, user, password,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage, // solo sqlite (definido en .env)
    omitNull: true     // solo Postgres
  }
  );

// Se importan las definiciones de las tablas
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Se crean las relaciones
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Se exportan la definiciones de las tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

// Se inicializan las tablas
sequelize.sync().then(function() {
  Quiz.count().then(function(count) {
    if (count === 0) {
      Quiz.create({ pregunta:   'Capital de Italia',
                    respuesta:  'Roma',
                    tema:       'humanidades'
                  }).then(function(quiz) {
        Comment.create({ texto: 'Rome en inglés', publicado: true}).then(function(comment) {
          quiz.addComment(comment).then(function() {
             console.log('Base de datos inicializada')
          });
        })
      });
    };
  });
});
