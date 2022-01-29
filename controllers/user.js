const { response } = require("express");

const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { body } = require("express-validator");

const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos
  if (password) {
    //encriptar contrasenia
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar contrasenia
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  //guardar en DB
  await usuario.save();

  res.status(201).json({
    msg: "post Api - Controlador",
    usuario,
  });
};
const usuariosDelete = async (req, res) => {
  const { id } = req.params;
  const uid = req.uid;
  //fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;
  res.json({
    usuario,
    usuarioAutenticado,
  });
};
const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch Api - Controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPut,
  usuariosPatch,
};
