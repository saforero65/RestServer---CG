const { response } = require("express");
const { Modulo } = require("../models");
const obtenerModulos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, modulos] = await Promise.all([
    Modulo.countDocuments(query),
    Modulo.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    modulos,
  });
};
const obtenerModulo = async (req, res = response) => {
  const { id } = req.params;
  const modulo = await Modulo.findById(id).populate("usuario", "nombre");
  res.json(modulo);
};

const crearModulo = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const moduloDB = await Modulo.findOne({ nombre });

  if (moduloDB) {
    return res.status(400).json({
      msg: `La categoria ${moduloDB.nombre}, ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const modulo = new Modulo(data);

  //Guardar DB

  await modulo.save();

  res.status(201).json(modulo);
};

const actualizarModulo = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const modulo = await Modulo.findByIdAndUpdate(id, data, { new: true });
  res.json(modulo);
};
const borrarModulo = async (req, res = response) => {
  const { id } = req.params;
  const moduloBorrado = await Modulo.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(moduloBorrado);
};

module.exports = {
  crearModulo,
  obtenerModulos,
  obtenerModulo,
  actualizarModulo,
  borrarModulo,
};
