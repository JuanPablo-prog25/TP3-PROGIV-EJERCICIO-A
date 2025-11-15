import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
  const { error, login, isAuthenticated, logout, email } = useAuth();
  const [open, setOpen] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(correo, contraseña);
    if (result.success) {
      setOpen(false);
      setCorreo("");
      setContraseña("");
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <button onClick={() => setOpen(true)}>Ingresar</button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Sesión: {email}</span>
          <button className="secondary" onClick={logout}>Cerrar sesión</button>
        </div>
      )}

      <dialog open={open}>
        <article>
          <h2>Ingrese usuario y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label>Email:</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <label>Contraseña:</label>
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};