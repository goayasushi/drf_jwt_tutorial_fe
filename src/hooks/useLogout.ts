import { useRouter } from "next/navigation";

import axiosClient from "@/lib/axiosClient";
import { useUser } from "@/context/UserContext";

export const useLogout = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const logout = () => {
    // delete localStorage token
    localStorage.removeItem("access_token");

    // global user state reset
    setUser(null);

    router.push("/login");
  };

  return { logout };
};
