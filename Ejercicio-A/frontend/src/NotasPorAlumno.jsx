import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./Auth";

export const NotasPorAlumno = () => {
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const [notas, setNotas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuth(`http://localhost:3000/notas/alumno/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          setError(`Error ${res.status}: ${msg}`);
          return;
        }
        const data = await res.json();
        setNotas(data.notas);
      })
      .catch(() => setError("Error de conexión al cargar notas"));
  }, [id, fetchAuth]);

  return (
    <article>
      <h2>Notas del alumno</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notas.length === 0 ? (
        <p>No hay notas registradas para este alumno.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Nota 1</th>
              <th>Nota 2</th>
              <th>Nota 3</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((n, i) => (
              <tr key={i}>
                <td>{n.materia_nombre}</td>
                <td>{n.nota1}</td>
                <td>{n.nota2}</td>
                <td>{n.nota3}</td>
                <td>{n.promedio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
};