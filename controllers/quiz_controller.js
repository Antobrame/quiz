var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};


//GET /quizes/question
  exports.index = function(req, res,next) {
    var opciones = {};
    console.log('index');
    console.log(req.query.search);
    if (req.query.search)
     opciones = {where: ["pregunta like ?", '%' + req.query.search.replace('+','%') +'%']}
    models.Quiz.findAll(opciones).then(function(quizes) {
//      res.redirect('/quizes');
    res.render('quizes/index', { quizes: quizes, errors: []});
}).catch(function(error) { next(error);});
};
// GET /quizes/:id
exports.show = function(req, res) {
   res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer= function(req, res){
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta) {
     resultado = 'Correcto';
   }
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};


exports.create = function(req, res){
 var quiz = models.Quiz.build( req.body.quiz );

 quiz
 .validate()
 .then(
   function(err){
     if (err) {
       res.render('quizes/new', {quiz: quiz, errors: err.errors});
     } else {
       quiz // save: guarda en DB campos pregunta y respuesta de quiz
       .save({fields: ["pregunta", "respuesta"]})
       .then( function(){ res.redirect('/quizes')})
     }      // res.redirect: Redirección HTTP a lista de preguntas
   }
 ).catch(function(error){next(error)});
};
/*
 var errors = quiz.validate();//ya qe el objeto errors no tiene then(
 if (errors)
 {
 var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
 for (var prop in errors) errores[i++]={message: errors[prop]};
 res.render('quizes/new', {quiz: quiz, errors: errores});
 } else {
 quiz // save: guarda en DB campos pregunta y respuesta de quiz
 .save({fields: ["pregunta", "respuesta"]})
 .then( function(){ res.redirect('/quizes')}) ;
 }
};
*/
// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

//GET /authors
exports.authors= function(req, res){
  res.render('authors', {autor: 'Antonio Bravo Meseguer', errors: []});
};
