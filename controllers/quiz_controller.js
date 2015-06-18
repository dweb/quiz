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

// GET /quizes
exports.index = function(req, res) {
  var search = '%';

  if (req.query.search) {
    search += req.query.search.replace(/[ ]*/g, '%') + '%';
  }

  models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes});
  })
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var answer = (req.query.respuesta === req.quiz.respuesta) ? 'Correcto' : 'Incorrecto';

  res.render('quizes/answer', {quiz: req.quiz, respuesta: answer});
};
