const { v4: uuidv4 } = require("uuid");
const path = require("path");
const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif", "pdf"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    console.log(nombreCortado);
    const extension = nombreCortado[nombreCortado.length - 1];

    //validar la extension

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida, ${extensionesValidas}`
      );
    }

    // res.json({ extension });
    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemp);
    });
  });
};
module.exports = {
  subirArchivo,
};
