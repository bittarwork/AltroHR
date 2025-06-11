import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

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
          // إنشاء object مرة واحدة فقط
          const userData = { token: parsed.token, user: parsed.user };
          setUser(userData);
        } else {
          localStorage.removeItem("authData");
          setUser(null);
        }
      } catch (err) {
        console.error("فشل في قراءة بيانات الجلسة:", err);
        localStorage.removeItem("authData");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // تسجيل الدخول - استخدام useCallback لتثبيت الدالة
  const login = useCallback(async (email, password) => {
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
    // إنشاء object مرة واحدة فقط
    const userData = { token: data.token, user: data.user };
    setUser(userData);
  }, []);

  // تسجيل الخروج - استخدام useCallback لتثبيت الدالة
  const logout = useCallback(() => {
    localStorage.removeItem("authData");
    setUser(null);
  }, []);

  // استخدام useMemo لتثبيت context value
  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook مخصص
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
