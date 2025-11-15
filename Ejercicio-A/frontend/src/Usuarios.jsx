import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router-dom";

export const Usuarios = () => {
  const { fetchAuth } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/usuarios");
    const data = await response.json();
    if (response.ok && data.success) {
      setUsuarios(data.usuarios);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok && data.success) {
      fetchUsuarios();
    } else {
      window.alert("Error al eliminar usuario");
    }
  };

  return (
    <article>
      <h2>Usuarios</h2>
      <Link to="/usuarios/crear">Crear nuevo usuario</Link>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td><Link to={`/usuarios/${u.id}`}>{u.nombre}</Link></td>
              <td>{u.email}</td>
              <td>
                <Link to={`/usuarios/${u.id}/modificar`}>Modificar</Link>{" "}
                <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};