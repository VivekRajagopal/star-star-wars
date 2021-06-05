import { createContext, useContext, useEffect, useState } from "react";

export type TAuthContext = {
  isSignedIn: () => boolean;
  accessToken: string | null;
  setAccessToken: (a: string) => void;
  unsetAccessToken: () => void;
};

export const AuthContext = createContext<TAuthContext>({
  isSignedIn: () => false,
  accessToken: null,
  setAccessToken: () => {},
  unsetAccessToken: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setInMemoryAccessToken] = useState<string | null>(null);

  const setAccessToken = (at: string) => {
    localStorage.setItem("token", at);
    setInMemoryAccessToken(at);
  };

  const unsetAccessToken = () => {
    localStorage.removeItem("token");
    setInMemoryAccessToken("");
  };

  const isSignedIn = () => !!accessToken;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setInMemoryAccessToken(token);
  });

  return (
    <AuthContext.Provider value={{ isSignedIn, accessToken, setAccessToken, unsetAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
