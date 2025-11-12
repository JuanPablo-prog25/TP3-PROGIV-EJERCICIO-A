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

