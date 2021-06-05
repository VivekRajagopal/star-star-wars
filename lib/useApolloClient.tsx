import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { useAuthContext } from "./AuthProvider";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
  fetch
});

const cache = new InMemoryCache();

export const AuthenticatedApolloProvider = (element: { children: any } | undefined) => {
  const { accessToken } = useAuthContext();

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: any) => ({
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined
      }
    }));

    return forward(operation);
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache
  });

  return <ApolloProvider client={client}>{element?.children}</ApolloProvider>;
};
