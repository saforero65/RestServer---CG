const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  esRolValido,
  correoExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
  usuarioGet,
} = require("../controllers/user");

const router = Router();

router.get("/", usuariosGet);
router.get(
  "/:id",
  [
    check("id", "No es un ID Valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuarioGet
);

router.put(
  "/:id",
  [
    check("id", "No es un ID Valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    // check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre  es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check(
      "password",
      "El password es obligatorio debe tener mas de 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo").custom(correoExiste),
    //check("rol", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

router.patch("/", usuariosPatch);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID Valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);
module.exports = router;
