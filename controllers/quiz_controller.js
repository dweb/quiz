// /quizes/question
exports.question = function(req, res) {
    res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// /quizes/answer
exports.answer = function(req, res) {
    var answer = (req.query.respuesta === "Roma") ? 'Correcto' : 'Incorrecto';

    res.render('quizes/answer', {respuesta: answer});
};
