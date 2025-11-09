import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();


export function authConfig() {
    // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}


export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// Registro de usuario
router.post(
  "/register",
  body("nombre").isLength({ min: 3 }),
  body("email").isEmail(),
  body("contraseña").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
     minUppercase: 0,
     minSymbols: 0,

  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el email ya existe
    const [usuariosExistentes] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    await db.execute(
      "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    res.json({ success: true, message: "Usuario registrado correctamente" });
  }
);

// Login de usuario
router.post(
  "/login",
  body("email").isEmail(),
  body("contraseña").isLength({ min: 8 }),
  verificarValidaciones,
  async (req, res) => {
    const { email, contraseña } = req.body;

    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Usuario invalido" });
    }

    const usuario = usuarios[0];
    const passwordComparada = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña incorrecta" });
    }

    const payload = { userId: usuario.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({
      success: true,
      token,
      nombre: usuario.nombre,
      email: usuario.email,
    });
  }
);

export default router;