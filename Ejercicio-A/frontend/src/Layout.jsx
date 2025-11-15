import { Outlet, Link } from "react-router-dom";
import { Ingresar } from "./Ingresar";

export const Layout = () => {
  return (
    <main className="container">
      <header>
        <hgroup>
          <h1>Gestión de Alumnos</h1>
          <p>BIENVENIDO</p>
        </hgroup>
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
            <li><Link to="/alumnos">Alumnos</Link></li>
            <li><Link to="/materias">Materias</Link></li>
            <li><Link to="/notas">Notas</Link></li>
            <li><Link to="/promedios">Promedios</Link></li>
          </ul>
          <Ingresar />
        </nav>
      </header>

      <section>
        <Outlet />
      </section>
    </main>
  );
};