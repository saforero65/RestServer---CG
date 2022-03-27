const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Modulo, Cuestionario } = require("../models");
const coleccionesPermitidas = ["usuarios", "modulo", "cuestionario", "roles"];
const buscarUsuarios = async (termino = "", res = response) => {
  const esMogoID = ObjectId.isValid(termino);

  if (esMogoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({
    results: usuarios,
  });
};
const buscarModulos = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const modulo = await Modulo.findById(termino);
    return res.json({
      results: modulo ? [modulo] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const modulos = await Modulo.find({ nombre: regex, estado: true });

  res.json({
    results: modulos,
  });
};

const buscarCuestionarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const cuestionario = await Cuestionario.findById(termino).populate(
      "modulo",
      "pregunta"
    );
    return res.json({
      results: cuestionario ? [cuestionario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const cuestionarios = await Cuestionario.find({
    pregunta: regex,
    estado: true,
  }).populate("modulo", "pregunta");

  res.json({
    results: cuestionarios,
  });
};
const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "modulo":
      buscarModulos(termino, res);
      break;
    case "cuestionario":
      buscarCuestionarios(termino, res);
      break;
    case "roles":
      break;
    default:
      res.status(500).json({
        msg: "Se me olvido hacer esta busqueda",
      });
  }
};
module.exports = {
  buscar,
};
