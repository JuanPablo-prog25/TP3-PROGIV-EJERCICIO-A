import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";

export const Notas = () => {
  const { fetchAuth } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [values, setValues] = useState({
    alumno_id: "",
    materia_id: "",
    nota1: "",
    nota2: "",
    nota3: "",
  });

  const fetchAlumnos = useCallback(async () => {
    const res = await fetchAuth("http://localhost:3000/alumnos");
    const data = await res.json();
    if (res.ok && data.success) setAlumnos(data.alumnos);
  }, [fetchAuth]);

  const fetchMaterias = useCallback(async () => {
    const res = await fetchAuth("http://localhost:3000/materias");
    const data = await res.json();
    if (res.ok && data.success) setMaterias(data.materias);
  }, [fetchAuth]);

  useEffect(() => {
    fetchAlumnos();
    fetchMaterias();
  }, [fetchAlumnos, fetchMaterias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchAuth("http://localhost:3000/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) return window.alert("Error al asignar notas");
    window.alert("Notas asignadas correctamente");
  };

  return (
    <article>
      <h2>Asignar notas</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Alumno
            <select required value={values.alumno_id} onChange={(e) => setValues({ ...values, alumno_id: e.target.value })}>
              <option value="">Seleccione</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </label>
          <label>
            Materia
            <select required value={values.materia_id} onChange={(e) => setValues({ ...values, materia_id: e.target.value })}>
              <option value="">Seleccione</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Nota 1
            <input type="number" min="0" max="10" required value={values.nota1} onChange={(e) => setValues({ ...values, nota1: e.target.value })} />
          </label>
          <label>
            Nota 2
            <input type="number" min="0" max="10" required value={values.nota2} onChange={(e) => setValues({ ...values, nota2: e.target.value })} />
          </label>
          <label>
            Nota 3
            <input type="number" min="0" max="10" required value={values.nota3} onChange={(e) => setValues({ ...values, nota3: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Asignar notas" />
      </form>
    </article>
  );
};