import { Link } from "react-router";

export const Home = () => {
  return (
    <article>
      <h1>Gestión de alumnos</h1>
      <ul>
        <li><Link to="/alumnos">Listado de alumnos</Link></li>
        <li><Link to="/materias">Listado de materias</Link></li>
        <li><Link to="/notas">Carga y visualización de notas</Link></li>
        <li><Link to="/promedios">Ver promedios</Link></li>
      </ul>
    </article>
  );
};