import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  role: string;
  socialProvider: string;
  createdAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else {
        // 토큰이 유효하지 않은 경우
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }

    // 스토리지 이벤트 감지 (로그인/로그아웃 대응)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("accessToken");
      if (newToken) {
        fetchUser(newToken);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  return { user, loading, logout };
};
