const { Modulo, Usuario, Role, Cuestionario } = require("../models");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la DB`);
  }
};

const correoExiste = async (correo = "") => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo ${correo}, ya esta registrado)`);
  }
};

const cuestionarioExiste = async (pregunta = "") => {
  const existeCuestionario = await Cuestionario.findOne({ pregunta });
  if (existeCuestionario) {
    throw new Error(`El cuestionario ${pregunta}, ya esta registrado)`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id}, no existe`);
  }
};

const existeModuloPorId = async (id) => {
  const existeModulo = await Modulo.findById(id);
  if (!existeModulo) {
    throw new Error(`El id ${id}, no existe`);
  }
};

const existeCuestionarioPorId = async (id) => {
  const existeCuestionario = await Cuestionario.findById(id);
  if (!existeCuestionario) {
    throw new Error(`El id ${id}, no existe`);
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida,${colecciones}`);
  }
  return true;
};
module.exports = {
  coleccionesPermitidas,
  esRolValido,
  correoExiste,
  cuestionarioExiste,
  existeUsuarioPorId,
  existeModuloPorId,
  existeCuestionarioPorId,
};
