const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCuestionario,
  obtenerCuestionarios,
  obtenerCuestionario,
  actualizarCuestionario,
  borrarCuestionario,
} = require("../controllers/cuestionarios");

const {
  existeModuloPorId,
  existeCuestionarioPorId,
  cuestionarioExiste,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las categorias - publico
router.get("/", obtenerCuestionarios);
//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeCuestionarioPorId),
    validarCampos,
  ],
  obtenerCuestionario
);

//Crear categoria -provado - cualuir persona con un token valido
router.post(
  "/",
  [
    validarJWT,

    check("pregunta", "El nombre es obligatorio").not().isEmpty(),

    check("modulo", "No es un id de mongo").isMongoId(),
    check("modulo").custom(existeModuloPorId),
    validarCampos,
  ],
  crearCuestionario
);

//Actualizar - privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "No es un id de mongo").isMongoId(),
    check("id").custom(existeCuestionarioPorId),
    validarCampos,
  ],
  actualizarCuestionario
);

//Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeCuestionarioPorId),
    validarCampos,
  ],
  borrarCuestionario
);
module.exports = router;
