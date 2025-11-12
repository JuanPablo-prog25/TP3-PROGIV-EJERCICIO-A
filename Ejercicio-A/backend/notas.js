import express from "express";
import { db } from "./db.js";
import { verificarAutenticacion } from "./auth.js";
import { body } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

//  post para asignar notas
router.post(
  "/",
  verificarAutenticacion,
  body("alumno_id").isInt({ min: 1 }),
  body("materia_id").isInt({ min: 1 }),
  body("nota1").isFloat({ min: 0, max: 10 }),
  body("nota2").isFloat({ min: 0, max: 10 }),
  body("nota3").isFloat({ min: 0, max: 10 }),
  verificarValidaciones,
  async (req, res) => {
    const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

    await db.execute(
      "INSERT INTO notas (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
      [alumno_id, materia_id, nota1, nota2, nota3]
    );

    res.status(201).json({ success: true, message: "Notas asignadas correctamente" });
  }
);

// obtener todas las notas
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT n.*, a.nombre AS alumno, m.nombre AS materia
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
    ORDER BY alumno, materia
  `);

  res.json({ success: true, notas: rows });
});

// obtener notas de un alumnos
router.get(
  "/alumno/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      `SELECT n.*, m.nombre AS materia
       FROM notas n
       JOIN materias m ON n.materia_id = m.id
       WHERE n.alumno_id=?`,
      [id]
    );

    res.json({ success: true, notas: rows });
  }
);

// obtener notas por materia
router.get(
  "/materia/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      `SELECT n.*, a.nombre AS alumno
       FROM notas n
       JOIN alumnos a ON n.alumno_id = a.id
       WHERE n.materia_id=?`,
      [id]
    );

    res.json({ success: true, notas: rows });
  }
);

// obtener promedio por alumnos y materia
router.get("/promedios", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      a.nombre AS alumno,
      m.nombre AS materia,
      ROUND((n.nota1 + n.nota2 + n.nota3)/3, 2) AS promedio
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
    ORDER BY alumno, materia
  `);

  res.json({ success: true, promedios: rows });
});

export default router;