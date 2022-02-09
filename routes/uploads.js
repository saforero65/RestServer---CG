const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const { validarCampos, validarArchivoSubir } = require("../middlewares");
const { route } = require("./auth");

const router = Router();
router.get(
  "/:coleccion/:id",
  [
    // validarArchivoSubir,
    check("id", "EL id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);
router.post("/", validarArchivoSubir, cargarArchivo);
router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "EL id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

module.exports = router;
