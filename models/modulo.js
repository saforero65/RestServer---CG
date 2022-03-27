const { Schema, model } = require("mongoose");

const ModuloSchema = Schema({
  nombre: {
    type: String,
    required: [true, "EL nombre es obligatorio"],
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
});
ModuloSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();

  return data;
};
module.exports = model("Modulo", ModuloSchema);
