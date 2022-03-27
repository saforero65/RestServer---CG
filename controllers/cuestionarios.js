const { response } = require("express");
const { body } = require("express-validator");
const { Cuestionario } = require("../models");
const obtenerCuestionarios = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, cuestionarios] = await Promise.all([
    Cuestionario.countDocuments(query),
    Cuestionario.find(query)
      .populate("usuario", "nombre")
      .populate("modulo", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    cuestionarios,
  });
};
const obtenerCuestionario = async (req, res = response) => {
  const { id } = req.params;
  const cuestionario = await Cuestionario.findById(id)
    .populate("usuario", "nombre")
    .populate("modulo", "nombre");
  res.json(cuestionario);
};

const crearCuestionario = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;
  const pregunta = req.body.pregunta.toUpperCase();

  const cuestionarioDB = await Cuestionario.findOne({
    pregunta,
  });

  // console.log(req);

  if (cuestionarioDB) {
    return res.status(400).json({
      msg: `El cuestionario ${cuestionarioDB.pregunta}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    ...body,
    pregunta: body.pregunta.toUpperCase(),
    usuario: req.usuario._id,
  };

  const cuestionario = new Cuestionario(data);

  //Guardar DB

  await cuestionario.save();

  res.status(201).json(cuestionario);
};

const actualizarCuestionario = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.pregunta) {
    data.pregunta = data.pregunta.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const cuestionario = await Cuestionario.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.json(cuestionario);
};
const borrarCuestionario = async (req, res = response) => {
  const { id } = req.params;
  const cuestionarioBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(cuestionarioBorrado);
};

module.exports = {
  crearCuestionario,
  obtenerCuestionarios,
  obtenerCuestionario,
  actualizarCuestionario,
  borrarCuestionario,
};
