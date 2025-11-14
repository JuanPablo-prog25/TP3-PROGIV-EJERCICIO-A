import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearMateria = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);
  const [values, setValues] = useState({
    nombre: "",
    codigo: "",
    año: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/materias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: values.nombre,
        codigo: values.codigo,
        año: Number(values.año), 
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      console.log("Error:", data);
      if (response.status === 400) return setErrores(data.errores || [data.message]);
      return window.alert("Error al crear materia");
    }

    navigate("/materias");
  };

  return (
    <article>
      <h2>Crear materia</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>
          <label>
            Código
            <input
              required
              value={values.codigo}
              onChange={(e) => setValues({ ...values, codigo: e.target.value })}
            />
          </label>
          <label>
            Año
            <input
              required
              type="number"
              min="2000"
              max="2100"
              value={values.año}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Crear materia" />
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