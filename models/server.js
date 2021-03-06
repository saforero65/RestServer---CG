const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      modulos: "/api/modulos",
      cuestionarios: "/api/cuestionarios",
      usuarios: "/api/usuarios",
      uploads: "/api/uploads",
    };

    //Conectar a DB
    this.conectarDB();
    //Middlewares
    this.middlewares();
    //Rutas de mi aplicación
    this.routes();
  }
  async conectarDB() {
    await dbConnection();
  }
  middlewares() {
    //CORS
    this.app.use(cors());

    // Lectura y Parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));

    //File Upload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.modulos, require("../routes/modulos"));
    this.app.use(this.paths.cuestionarios, require("../routes/cuestionarios"));
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}
module.exports = Server;
