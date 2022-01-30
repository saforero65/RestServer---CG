const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las categorias - publico
router.get("/", obtenerProductos);
//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//Crear categoria -provado - cualuir persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

//Actualizar - privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "No es un id de mongo").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

//Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "NO es un id de mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);
module.exports = router;
