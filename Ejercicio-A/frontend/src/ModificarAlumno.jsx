import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

export const ModificarAlumno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const [alumno, setAlumno] = useState(null);
  const [errores, setErrores] = useState(null);

  useEffect(() => {
    const cargarAlumno = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          return setErrores(["no se pudo cargar el alumno"]);
        }
        setAlumno(data.alumno);
      } catch (err) {
        setErrores(["error al obtener los datos del alumno"]);
      }
    };

    cargarAlumno();
  }, [id, fetchAuth]);

  const handleChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return setErrores(data.errores || [data.message || "error al guardar los cambios"]);
    }

    navigate("/alumnos");
  };

  if (!alumno) return <p>Cargando datos del alumno...</p>;

  return (
    <article>
      <h2>Modificar alumno #{id}</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              name="nombre"
              value={alumno.nombre}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellido
            <input
              required
              name="apellido"
              value={alumno.apellido}
              onChange={handleChange}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              name="email"
              value={alumno.email}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar cambios" />
      </form>

      {errores && (
        <ul style={{ color: "red" }}>
          {errores.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
    </article>
  );
};