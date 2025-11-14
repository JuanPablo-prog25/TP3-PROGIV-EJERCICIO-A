import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate, Link } from "react-router-dom";

export const Alumnos = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);

  const fetchAlumnos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/alumnos");
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError("No se pudieron obtener los alumnos");
        return;
      }
      setAlumnos(data.alumnos);
    } catch (err) {
      setError("Error al cargar los alumnos");
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handleQuitar = async (id) => {
    if (!window.confirm("eliminar este alumno?")) return;

    try {
      const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return window.alert(data.message || "no se pudo eliminar el alumno");
      }
      setAlumnos((prev) => prev.filter((a) => a.id !== id));
    } catch {
      window.alert("error de conexion al intentar eliminar");
    }
  };

  const handleModificar = (id) => {
    navigate(`/alumnos/${id}/modificar`);
  };

  return (
    <article>
      <h2>Listado de alumnos</h2>
      <Link to="/alumnos/crear" role="button">Crear nuevo alumno</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {alumnos.length === 0 ? (
        <p>No hay alumnos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.apellido}</td>
                <td>{a.email}</td>
                <td>
                  <button onClick={() => handleModificar(a.id)}>Modificar</button>{" "}
                  <button onClick={() => handleQuitar(a.id)}>Eliminar</button>
                  <Link to={`/notas/alumno/${a.id}`}>Ver notas</Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
};