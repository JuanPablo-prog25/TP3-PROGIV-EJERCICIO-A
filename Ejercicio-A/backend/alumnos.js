import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM alumnos ORDER BY apellido, nombre");
  res.json({ success: true, alumnos: rows });
});

//busca por id
router.get(
  "/:id",
  //Aqui si se autentica
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  //Aqui no se autentica
  //verificarAutenticacion,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM alumnos WHERE id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Alumno no encontrado" });
    }

    res.json({ success: true, alumno: rows[0] });
  }
);

//crea el alumno
router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre invalido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido invalido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni", "DNI invalido").isInt({ min: 1000000 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni } = req.body;

    // Verificar si el DNI ya existe
    const [existente] = await db.execute("SELECT * FROM alumnos WHERE dni=?", [dni]);
    if (existente.length > 0) {
      return res.status(400).json({ success: false, message: "DNI ya registrado" });
    }

    const [result] = await db.execute(
      "INSERT INTO alumnos (nombre, apellido, dni) VALUES (?, ?, ?)",
      [nombre, apellido, dni]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, apellido, dni },
    });
  }
);

//modifica el alumno
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").optional().isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido").optional().isAlpha("es-ES").isLength({ max: 50 }),
  body("dni").optional().isInt({ min: 1000000 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni } = req.body;

    const [existe] = await db.execute("SELECT * FROM alumnos WHERE id=?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ success: false, message: "Alumno no encontrado" });
    }

    await db.execute(
      "UPDATE alumnos SET nombre=?, apellido=?, dni=? WHERE id=?",
      [
        nombre || existe[0].nombre,
        apellido || existe[0].apellido,
        dni || existe[0].dni,
        id,
      ]
    );

    res.json({ success: true, message: "Alumno actualizado correctamente" });
  }
);

//elimina el alumno
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM alumnos WHERE id=?", [id]);
    res.json({ success: true, message: "Alumno eliminado", id });
  }
);

export default router;