import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearUsuario = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);
  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contraseña: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);
    const response = await fetchAuth("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      if (response.status === 400) return setErrores(data.errores);
      return window.alert("Error al crear usuario");
    }
    navigate("/usuarios");
  };

  return (
    <article>
      <h2>Crear usuario</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
          </label>
          <label>
            Email
            <input required type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
          </label>
          <label>
            Contraseña
            <input required type="password" value={values.contraseña} onChange={(e) => setValues({ ...values, contraseña: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Crear usuario" />
      </form>
    </article>
  );
};