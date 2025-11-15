import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";

export const Promedios = () => {
  const { fetchAuth } = useAuth();
  const [promedios, setPromedios] = useState([]);
  const [error, setError] = useState(null);

  const fetchPromedios = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/notas/promedios");
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError("No se pudieron obtener los promedios");
        return;
      }
      setPromedios(data.promedios);
    } catch (err) {
      setError("Error al cargar los promedios");
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchPromedios();
  }, [fetchPromedios]);

  return (
    <article>
      <h2>Promedios por alumno y materia</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {promedios.length === 0 ? (
        <p>No hay promedios disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Materia</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {promedios.map((p, i) => (
              <tr key={`${p.id}-${p.materia_nombre}-${i}`}>
                <td>{p.id}</td>
                <td>{p.alumno_nombre}</td>
                <td>{p.alumno_apellido}</td>
                <td>{p.materia_nombre}</td>
                <td>{Number(p.promedio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
};