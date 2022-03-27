const { Schema, model } = require("mongoose");

const CuestionarioSchema = Schema({
  pregunta: {
    type: String,
    required: [true, "La pregunta es obligatoria"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  respuestas: {
    type: Array,
    default: ["", "", "", ""],
    required: true,
  },
  modulo: {
    type: Schema.Types.ObjectId,
    ref: "Modulo",
    required: true,
  },
});
CuestionarioSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};
module.exports = model("Cuestionario", CuestionarioSchema);
