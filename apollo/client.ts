import fetch from "node-fetch";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const swGraphQLApi = createHttpLink({
  uri: "https://swapi-peach.vercel.app/"
  // fetch
});

export const swClient = new ApolloClient({
  link: swGraphQLApi,
  cache: new InMemoryCache()
});

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;
