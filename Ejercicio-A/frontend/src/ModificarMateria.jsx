import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarMateria = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);

  const fetchMateria = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/materias/${id}`);
    const data = await response.json();
    if (!response.ok || !data.success) return;
    setValues(data.materia);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchMateria();
  }, [fetchMateria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok || !data.success) return window.alert("Error al modificar materia");
    navigate("/materias");
  };

  if (!values) return null;

  return (
    <article>
      <h2>Modificar materia</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
          </label>
          <label>
            Código
            <input required value={values.codigo} onChange={(e) => setValues({ ...values, codigo: e.target.value })} />
          </label>
          <label>
            Año
            <input required value={values.anio} onChange={(e) => setValues({ ...values, anio: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Modificar materia" />
      </form>
    </article>
  );
};