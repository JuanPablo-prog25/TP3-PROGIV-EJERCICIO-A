import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearAlumno = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth("http://localhost:3000/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      navigate("/alumnos");
    } else {
      const errores = Array.isArray(data.errores)
        ? data.errores.map((e) => (typeof e === "string" ? e : e.msg)).join("\n")
        : data.message || "Error al crear alumno";
      window.alert(errores);
    }
  };

  return (
    <article>
      <h2>Crear nuevo alumno</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              name="nombre"
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>
          <label>
            Apellido
            <input
              name="apellido"
              value={values.apellido}
              onChange={(e) => setValues({ ...values, apellido: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </label>
          <label>
            DNI
            <input
              name="dni"
              value={values.dni}
              onChange={(e) => setValues({ ...values, dni: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Crear alumno" />
      </form>
    </article>
  );
};