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

// Se importa la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Se exporta la definición de la tabla Quiz
exports.Quiz = Quiz;

// Se inicializa la tabla
sequelize.sync().then(function() {
  Quiz.count().then(function(count) {
    if (count === 0) {
      Quiz.create({ pregunta:   'Capital de Italia',
                    respuesta:  'Roma'
                  })
      .then(function() { console.log('Base de datos inicializa')});
    };
  });
});
