import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import alumnosRouter from "./alumnos.js";
import materiasRouter from "./materias.js"
import notasRouter from "./notas.js";
import usuariosRouter from "./usuarios.js"
import authRouter, { authConfig } from "./auth.js";

await conectarDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

authConfig();

app.get("/", (req, res) => {
  res.send("gestion de alumnos");
});

app.use("/auth", authRouter);
app.use("/alumnos", alumnosRouter);
app.use("/materias", materiasRouter);
app.use("/notas", notasRouter);
app.use("/usuarios", usuariosRouter);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en el puerto ${port}`);
});