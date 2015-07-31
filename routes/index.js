var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autor
router.get('/author', function(req, res) {
  res.render('author', { errors: [] });
});

router.param('quizId',    quizController.load); // Autoload :quizId
router.param('commentId', commentController.load); // Autoload :commentId

// Rutas de sesión
router.get('/login',  sessionController.new);     // formulario de login
router.get('/logout', sessionController.destroy); // destruir la sesión
router.post('/login', sessionController.create);  // crear la sesión


// Rutas de preguntas
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);

// Rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                                                 sessionController.loginRequired, commentController.publish)
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);

module.exports = router;
