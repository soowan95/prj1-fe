import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);

function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  function fetchLogin() {
    axios.get("/api/member/login").then(({ data }) => setLogin(data));
  }

  function isAuthenticated() {
    return login !== "";
  }

  function isAdmin() {
    if (login === "") return false;
    return login.auth.some((e) => e.name === "admin");
  }

  function hasAccess(userId) {
    return login.id === userId;
  }

  useEffect(() => {
    fetchLogin();
  }, []);

  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
