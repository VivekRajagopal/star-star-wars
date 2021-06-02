import { ApolloServer, mergeSchemas } from "apollo-server-micro";

import { createSchema } from "../../../graphql/schema";
import { createContext } from "../../../graphql/context";

export const config = {
  api: {
    bodyParser: false
  }
};

const createApolloServerHandler = async (req: any, res: any) => {
  const apolloServer = new ApolloServer({
    context: createContext,
    schema: await createSchema(),
    tracing: process.env.NODE_ENV === "development"
  });

  return apolloServer.createHandler({
    path: "/api/graphql"
  })(req, res);
};

export default createApolloServerHandler;
