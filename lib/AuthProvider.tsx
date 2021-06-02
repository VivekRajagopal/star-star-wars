import { createContext, useContext, useState } from "react";

export type TAuthContext = {
  accessToken?: string;
  setAccessToken: (a: string) => void;
};

export const AuthContext = createContext<TAuthContext>({
  accessToken: undefined,
  setAccessToken: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string | undefined>();

  return <AuthContext.Provider value={{ accessToken, setAccessToken }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
