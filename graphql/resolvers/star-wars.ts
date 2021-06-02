import { introspectSchema, wrapSchema, makeRemoteExecutableSchema } from "@graphql-tools/wrap";
import { ASTNode, print } from "graphql";
import gql from "graphql-tag";
import fetch from "node-fetch";

async function remoteExecutor({ document, variables }: { document: ASTNode; variables?: Record<string, any> }) {
  const query = print(document);
  const fetchResult = await fetch("https://swapi-peach.vercel.app/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  const result = await fetchResult.json();

  return result;
}

export const starWarsSubSchema = async () => {
  return makeRemoteExecutableSchema({
    schema: await introspectSchema(remoteExecutor),
    executor: remoteExecutor
  });
};

export const getPersonQuery = (id: string) => gql`
query {
  person(id: "${id}") {
    name
    id
    height
    eyeColor
  }
}
`;
