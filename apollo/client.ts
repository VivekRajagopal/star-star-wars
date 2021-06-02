import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";

const swGraphQLApi = createHttpLink({
  uri: "https://swapi-peach.vercel.app/"
});

export const swClient = new ApolloClient({
  link: swGraphQLApi,
  cache: new InMemoryCache()
});

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql"
});

const authLink = (accessToken?: string) =>
  new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: any) => ({
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined
      }
    }));

    return forward(operation);
  });

const client = (accessToken?: string) =>
  new ApolloClient({
    link: authLink(accessToken).concat(httpLink),
    cache: new InMemoryCache()
  });

export default client;
