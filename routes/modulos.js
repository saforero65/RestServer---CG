const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearModulo,
  obtenerModulo,
  obtenerModulos,
  actualizarModulo,
  borrarModulo,
} = require("../controllers/modulos");
const { existeModuloPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las modulos - publico
router.get("/", obtenerModulos);
//Obtener un modulo por id - publico
router.get(
  "/:id",
  [
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeModuloPorId),
    validarCampos,
  ],
  obtenerModulo
);

//Crear modulo -provado - cualuir persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearModulo
);

//Actualizar - privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeModuloPorId),
    validarCampos,
  ],
  actualizarModulo
);

//Borrar un modulo - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeModuloPorId),
    validarCampos,
  ],
  borrarModulo
);
module.exports = router;
