import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useParams } from "react-router-dom";

export const DetallesUsuario = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  const fetchUsuario = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
    const data = await response.json();
    if (response.ok && data.success) {
      setUsuario(data.usuario);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  if (!usuario) return null;

  return (
    <article>
      <h2>Detalles del usuario</h2>
      <ul>
        <li><strong>ID:</strong> {usuario.id}</li>
        <li><strong>Nombre:</strong> {usuario.nombre}</li>
        <li><strong>Email:</strong> {usuario.email}</li>
      </ul>
    </article>
  );
};