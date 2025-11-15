import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthPage } from "./Auth.jsx";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { Ingresar } from "./Ingresar.jsx";

// usuarios
import { Usuarios } from "./Usuarios.jsx";
import { CrearUsuario } from "./CrearUsuario.jsx";
import { ModificarUsuario } from "./ModificarUsuario.jsx";
import { DetallesUsuario } from "./DetallesUsuario.jsx";

// alumnos
import { Alumnos } from "./Alumnos.jsx";
import { CrearAlumno } from "./CrearAlumno.jsx";
import { ModificarAlumno } from "./ModificarAlumno.jsx";
import { NotasPorAlumno } from "./NotasPorAlumno";


// materias
import { Materias } from "./Materias.jsx";
import { CrearMateria } from "./CrearMateria.jsx";
import { ModificarMateria } from "./ModificarMateria.jsx";

// notas
import { Notas } from "./Notas.jsx";

// promedios
import { Promedios } from "./Promedios.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* rutas para el usuario*/}
            <Route path="usuarios" element={<AuthPage><Usuarios /></AuthPage>} />
            <Route path="usuarios/crear" element={<AuthPage><CrearUsuario /></AuthPage>} />
            <Route path="usuarios/:id" element={<AuthPage><DetallesUsuario /></AuthPage>} />
            <Route path="usuarios/:id/modificar" element={<AuthPage><ModificarUsuario /></AuthPage>} />

            {/* rutas para el alumno */}
            <Route path="alumnos" element={<AuthPage><Alumnos /></AuthPage>} />
            <Route path="alumnos/crear" element={<AuthPage><CrearAlumno /></AuthPage>} />
            <Route path="alumnos/:id/modificar" element={<AuthPage><ModificarAlumno /></AuthPage>} />

            {/* rutas para las materias*/}
            <Route path="materias" element={<AuthPage><Materias /></AuthPage>} />
            <Route path="materias/crear" element={<AuthPage><CrearMateria /></AuthPage>} />
            <Route path="materias/:id/modificar" element={<AuthPage><ModificarMateria /></AuthPage>} />

            {/* rutas para las notas */}
            <Route path="notas" element={<AuthPage><Notas /></AuthPage>} />

            {/* ruta para el promedio */}
            <Route path="promedios" element={<AuthPage><Promedios /></AuthPage>} />

           <Route path="/notas/alumno/:id" element={<NotasPorAlumno />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);