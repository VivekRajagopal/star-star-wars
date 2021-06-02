import gql from "graphql-tag";
import { makeSchema, nonNull, objectType, queryField, queryType, stringArg } from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { swClient } from "../apollo/client";
import prisma from "../lib/prisma";
import { Context } from "./context";
import { getPersonQuery, starWarsSubSchema } from "./resolvers/star-wars";
import { UserResolver } from "./resolvers/users";
import { assertUserSignedIn } from "./util";

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.model("User").id();
    t.nonNull.model("User").email();
    t.model("User").username();
  }
});

const StarredCharacter = objectType({
  name: "StarredCharacter",
  definition(t) {
    t.model.id();
    t.model.externalId();
    t.model.userId();
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.password();
    t.model.username();
    t.list.field("starredCharacters", {
      type: "Person",
      resolve: async (parent, _, context: Context) => {
        const starredCharacters = await context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined }
          })
          .starredCharacters();

        console.log(starredCharacters);

        const result = await Promise.all(
          starredCharacters
            .map(({ externalId }) => getPersonQuery(externalId))
            .map((query) => swClient.query({ query }))
        );

        console.log(result);

        return result.map(({ data }) => data.person);
      }
    });
  }
});

const Query = queryType({
  definition(t) {
    t.list.field("Users", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        const result = await prisma.user.findMany({});
        // console.log(result);
        return result;
      }
    });

    t.list.field("allCharacters", {
      type: "Person",
      resolve: async (source, args, context: Context) => {
        assertUserSignedIn(context);

        const query = gql`
          query {
            allPeople {
              people {
                name
                id
                height
                eyeColor
              }
            }
          }
        `;

        const { data } = await swClient.query({ query });
        return data.allPeople.people;
      }
    });

    t.field("character", {
      type: "Person",
      args: {
        id: nonNull(stringArg())
      },
      resolve: async (source, { id }, context: Context) => {
        assertUserSignedIn(context);

        const { data } = await swClient.query({ query: getPersonQuery(id) });
        return data.person;
      }
    });

    t.field("me", {
      type: "User",
      resolve: async (source, args, context: Context) => {
        const userId = assertUserSignedIn(context);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        console.log(user);
        return user;
      }
    });
  }
});

export const createSchema = async () =>
  makeSchema({
    types: [Query, AuthPayload, StarredCharacter, User, UserResolver, await starWarsSubSchema()],
    plugins: [nexusPrisma({ experimentalCRUD: true })],
    outputs: {
      typegen: `${process.cwd()}/generated/nexus-typegen.ts`,
      schema: `${process.cwd()}/generated/schema.graphql`
    },
    features: {
      abstractTypeRuntimeChecks: false
    }
  });
