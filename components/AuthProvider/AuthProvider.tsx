import { gql } from "@apollo/client";
import { createContext, ReactChildren, useContext, useState } from "react";
import client from "../../apollo/client";

const AuthContext = createContext<typeof useProvideAuth | undefined>(undefined);

function useProvideAuth() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const getAuthorizationHeader = () =>
    accessToken
      ? {
          authorization: `Bearer ${accessToken}`
        }
      : null;

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const loginMutation = gql`
      mutation LoginUserMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    const result = await client.mutate({ mutation: loginMutation, variables: { email, password } });

    console.log(result);

    if (result?.data?.token) {
      setAccessToken(result.data.token);
    }
  };

  const signOut = () => {
    setAccessToken(undefined);
  };

  return {
    accessToken,
    setAccessToken,
    getAuthorizationHeader,
    signIn,
    signOut
  };
}

export const AuthProvider = ({ children }: { children: ReactChildren }) => {
  return <AuthContext.Provider value={useProvideAuth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
