import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthContext } from "./AuthProvider";

export const requireAuth = () => {
  const { isSignedIn } = useAuthContext();
  const router = useRouter();

  return useEffect(() => {
    if (!isSignedIn()) {
      router.push("/auth/login");
    }
  });
};
