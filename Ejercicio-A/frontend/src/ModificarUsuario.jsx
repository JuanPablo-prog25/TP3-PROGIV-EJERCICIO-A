import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarUsuario = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);

  const fetchUsuario = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
    const data = await response.json();
    if (response.ok && data.success) {
      setValues(data.usuario);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok || !data.success) return window.alert("Error al modificar usuario");
    navigate("/usuarios");
  };

  if (!values) return null;

  return (
    <article>
      <h2>Modificar usuario</h2>
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
        </fieldset>
        <input type="submit" value="Modificar usuario" />
      </form>
    </article>
  );
};