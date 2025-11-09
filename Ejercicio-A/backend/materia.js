import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM materias ORDER BY año, nombre");
  res.json({ success: true, materias: rows });
});

//busca las materias por id
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM materias WHERE id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Materia no encontrada" });
    }

    res.json({ success: true, materia: rows[0] });
  }
);

//crear materia
router.post(
  "/",
  verificarAutenticacion,
  body("nombre").isLength({ min: 3 }),
  body("codigo").isAlphanumeric("es-ES").isLength({ max: 10 }),
  body("año").isInt({ min: 2000, max: 2100 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, codigo, año } = req.body;

    const [existente] = await db.execute("SELECT * FROM materias WHERE codigo=?", [codigo]);
    if (existente.length > 0) {
      return res.status(400).json({ success: false, message: "Codigo ya registrado" });
    }

    const [result] = await db.execute(
      "INSERT INTO materias (nombre, codigo, año) VALUES (?, ?, ?)",
      [nombre, codigo, año]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, codigo, año },
    });
  }
);

