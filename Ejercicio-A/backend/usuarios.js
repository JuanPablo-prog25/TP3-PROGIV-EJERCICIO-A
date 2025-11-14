import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtener todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email FROM usuarios");
  res.json({ success: true, usuarios: rows });
});

// obtener un usuario por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  }
);

// crear un nuevo usuario
router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre invalido").isLength({ min: 3 }),
  body("email", "Email invalido").isEmail(),
  body("contraseña", "Contraseña invalida").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // valida si email existe
    const [existente] = await db.execute("SELECT * FROM usuarios WHERE email=?", [email]);
    if (existente.length > 0) {
      return res.status(400).json({ success: false, message: "Email ya registrado" });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, email },
    });
  }
);

// modificar un usuario
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").optional().isLength({ min: 3 }),
  body("email").optional().isEmail(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    const [existe] = await db.execute("SELECT * FROM usuarios WHERE id=?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute(
      "UPDATE usuarios SET nombre=?, email=? WHERE id=?",
      [
        nombre || existe[0].nombre,
        email || existe[0].email,
        id,
      ]
    );

    res.json({ success: true, message: "Usuario actualizado correctamente" });
  }
);

// eliminar un usuario
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.execute("DELETE FROM usuarios WHERE id=?", [id]);
    res.json({ success: true, message: "Usuario eliminado", id });
  }
);

export default router;