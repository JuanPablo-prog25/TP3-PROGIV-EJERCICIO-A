import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const session = await response.json();

      if (!response.ok || !session.success) {
        throw new Error(session.error || "Credenciales incorrectas");
      }

      setToken(session.token);
      setEmail(email);
      localStorage.setItem("token", session.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setError(null);
    localStorage.removeItem("token");
  };

  const fetchAuth = async (url, options = {}) => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) throw new Error("No está iniciada la sesión");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <h2>Debes iniciar sesion para ver el contenido</h2>;
};