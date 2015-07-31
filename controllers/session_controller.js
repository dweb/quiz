// MW de autorización
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// GET /login -- formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

// GET /logout
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());
};

// POST /login -- cerrar la sesión
exports.create = function(req, res) {
  var login    = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');

  userController.autenticar(login, password, function(error, user) {
      if (error) {
        req.session.errors = {msg: 'Se ha producido un error - ' + error};
        res.redirect('/login');
        return;
      }

      // Se crea la sesión y guardamos el id el username
      req.session.user = { id: user.id, username: user.username};

      // Redirección a la página de origen
      res.redirect(req.session.redir.toString());
  });
};
