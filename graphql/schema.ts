import gql from "graphql-tag";
import { makeSchema, nonNull, objectType, queryType, stringArg } from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { swClient } from "../apollo/client";
import prisma from "../lib/prisma";
import { Context } from "./context";
import { getPersonQuery, starWarsSubSchema } from "./star-wars";
import { UserResolver } from "./users";
import { assertUserSignedIn } from "./util";

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.model("User").id();
    t.nonNull.model("User").email();
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
    t.list.field("starredCharacters", {
      type: "Person",
      resolve: async (parent, _, context: Context) => {
        const starredCharacters = await context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined }
          })
          .starredCharacters();

        const result = await Promise.all(
          starredCharacters.map(({ externalId }) => swClient.query({ query: getPersonQuery(externalId) }))
        );

        return result.map(({ data }) => data.person);
      }
    });
  }
});

const Dashboard = objectType({
  name: "Dashboard",
  definition(t) {
    t.field("user", {
      type: "User"
    });

    t.list.field("characters", {
      type: "Person"
    });
  }
});

const Character = objectType({
  name: "Character",
  definition(t) {
    t.field("id", { type: "String" });
    t.field("name", { type: "String" });
    t.field("height", { type: "Int" });
    t.field("eyeColor", { type: "String" });
    t.field("isFavourite", { type: "Boolean" });
  }
});

const Query = queryType({
  definition(t) {
    // This is for dev purposes only. In production this query must be restricted to Admin access only.
    t.list.field("Users", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await prisma.user.findMany({});
      }
    });

    t.field("character", {
      type: "Character",
      args: {
        id: nonNull(stringArg())
      },
      resolve: async (source, { id }, context: Context) => {
        const userId = await assertUserSignedIn(context);

        const { data } = await swClient.query({ query: getPersonQuery(id) });

        const starredCharacter = await context.prisma.starredCharacter.findFirst({
          where: {
            userId,
            externalId: id
          }
        });

        return { ...data.person, isFavourite: starredCharacter !== null };
      }
    });

    t.field("dashboard", {
      type: "Dashboard",
      resolve: async (source, args, context: Context) => {
        const userId = assertUserSignedIn(context);

        const user = await prisma.user.findUnique({ where: { id: userId } });

        const allCharactersQuery = gql`
          query {
            allPeople {
              people {
                id
                name
                height
                eyeColor
              }
            }
          }
        `;

        const { data } = await swClient.query({ query: allCharactersQuery });

        return { user, characters: data.allPeople.people };
      }
    });
  }
});

export const createSchema = async () =>
  makeSchema({
    types: [Query, AuthPayload, StarredCharacter, Character, User, Dashboard, UserResolver, await starWarsSubSchema()],
    plugins: [nexusPrisma({ experimentalCRUD: true })],
    outputs: {
      typegen: `${process.cwd()}/generated/nexus-typegen.ts`,
      schema: `${process.cwd()}/generated/schema.graphql`
    },
    features: {
      abstractTypeRuntimeChecks: false
    }
  });
