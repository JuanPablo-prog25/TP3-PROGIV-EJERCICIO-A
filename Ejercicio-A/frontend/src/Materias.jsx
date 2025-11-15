import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router-dom";

export const Materias = () => {
  const { fetchAuth, isAuthenticated } = useAuth();
  const [materias, setMaterias] = useState([]);

  const fetchMaterias = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/materias");
    const data = await response.json();
    if (!response.ok || !data.success) return;
    setMaterias(data.materias);
  }, [fetchAuth]);

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  const handleQuitar = async (id) => {
    if (window.confirm("quitar la materia?")) {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        window.alert("error al quitar materia");
        return;
      }
      await fetchMaterias();
    }
  };

  return (
    <article>
      <h2>Materias</h2>
      <Link role="button" to="/materias/crear">Nueva materia</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.anio}</td>
              <td>
                <Link role="button" to={`/materias/${m.id}/modificar`}>Modificar</Link>
                {isAuthenticated && (
                  <button onClick={() => handleQuitar(m.id)}>Quitar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};