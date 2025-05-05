import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // عند أول تحميل، تحقق من وجود بيانات صالحة في التخزين
  useEffect(() => {
    const storedData = localStorage.getItem("authData");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const now = new Date().getTime();

        if (parsed.token && parsed.user && parsed.expiry > now) {
          setUser({ token: parsed.token, user: parsed.user });
        } else {
          localStorage.removeItem("authData");
        }
      } catch (err) {
        console.error("فشل في قراءة بيانات الجلسة:", err);
        localStorage.removeItem("authData");
      }
    }
  }, []);

  // تسجيل الدخول
  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const expiry = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 ساعات

    const authData = {
      token: data.token,
      user: data.user,
      expiry,
    };

    localStorage.setItem("authData", JSON.stringify(authData));
    setUser({ token: data.token, user: data.user });
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("authData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook مخصص
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
