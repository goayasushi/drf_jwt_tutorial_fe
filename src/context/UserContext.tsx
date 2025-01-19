"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";

// ユーザー情報の型定義
type User = {
  username: string;
  email: string;
  groups: string[];
};

// Contextで管理するデータ型
type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
};

// Contextの初期化
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

// UserProvider: ユーザー情報を取得して全体に提供する
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/account/auth-user/");
        setUser(res.data);
      } catch (err: any) {
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.message === "user not authenticated"
        ) {
          setUser(null);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// useUser: Contextの値を取得するカスタムフック
export const useUser = () => useContext(UserContext);
