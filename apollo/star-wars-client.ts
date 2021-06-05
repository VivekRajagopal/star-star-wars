import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

const swGraphQLApi = createHttpLink({
  uri: "https://swapi-peach.vercel.app/",
  fetch
});

export const swClient = new ApolloClient({
  link: swGraphQLApi,
  cache: new InMemoryCache()
});
