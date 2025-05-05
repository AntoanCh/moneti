import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (input) => {
    // const { data } = await axios.post("http://192.168.0.147:6969/auth/login", {
    //   ...input,
    // });
    // localStorage.setItem("token", data.token);
    // setUser({ name: input.username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
