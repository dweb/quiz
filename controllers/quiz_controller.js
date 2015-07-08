var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); })
}

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error) { next(error); })
}

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// GET /quizes
exports.index = function(req, res) {
  var search = '%';

  if (req.query.search) {
    search += req.query.search.replace(/[ ]*/g, '%') + '%';
  }

  models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
  })
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respuesta" }
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
}

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var answer = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto';

  res.render('quizes/answer', {quiz: req.quiz, respuesta: answer, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  var errors = quiz.validate()

  if (errors) {
    res.render('quizes/new', {quiz: quiz, errors: errors});
  } else {
    quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    .then(function() { res.redirect('/quizes'); });
  }
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  var errors = req.quiz.validate()

  if (errors) {
    res.render('quizes/edit', {quiz: req.quiz, errors: errors});
  } else {
    req.quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    .then(function() { res.redirect('/quizes'); });
  }
};
