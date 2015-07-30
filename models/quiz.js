// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {

return sequelize.define(
  'Quiz',
  { pregunta: {
      type: DataTypes.STRING,
      validate: { notEmpty: {msg: "-> Falta Pregunta"}}
    },
    respuesta: {
      type: DataTypes.STRING,
      validate: { notEmpty: {msg: "-> Falta Respuesta"}}
    },
    categoria: {
      type: DataTypes.STRING,
      validate: { isIn: {
                    args:[['Ciencia','Tecnologia', 'Humanidades', 'Ocio','Otro']],
                    msg:"Categoria erronea"
                  },
                  notEmpty: {msg: "-> Falta Categoria"}
      }
    }
  }
);
}
