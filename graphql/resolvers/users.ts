import { nonNull, objectType, stringArg } from "@nexus/schema";
import { compare, hash } from "bcryptjs";
import gql from "graphql-tag";
import { sign } from "jsonwebtoken";
import { swClient } from "../../apollo/client";
import prisma from "../../lib/prisma";
import { Context } from "../context";
import { assertUserSignedIn, getUserId } from "../util";

const JwtSigningKey = process.env.JWT_SIGNING_KEY;

export const UserResolver = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      resolve: async (_parent, { email, password }, _) => {
        const passwordHash = await hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email: email,
            password: passwordHash
          }
        });

        return {
          token: sign({ sub: user.id, email }, JwtSigningKey),
          id: user.id,
          email: user.email,
          username: user.username
        };
      }
    });

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      resolve: async (_parent, { email, password }, _) => {
        const user = await prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }

        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
          throw new Error("Invalid password");
        }

        return {
          token: sign({ sub: user.id, email: user.email }, JwtSigningKey),
          id: user.id,
          email: user.email,
          username: user.username
        };
      }
    });

    t.field("username", {
      type: "User",
      args: {
        username: nonNull(stringArg())
      },
      resolve: async (_parent, { username }, context: Context) => {
        const userId = getUserId(context);

        console.log(userId);

        const user = await prisma.user.findUnique({
          where: {
            id: userId
          }
        });

        if (!user) {
          throw new Error(`No user found with Id: ${userId}. Bearer Token ${context.req.headers.authorization}`);
        }

        return prisma.user.update({
          where: {
            id: userId
          },
          data: {
            ...user,
            username: username
          }
        });
      }
    });

    t.field("starCharacter", {
      type: "Person",
      args: {
        id: nonNull(stringArg())
      },
      resolve: async (source, { id }, context: Context) => {
        const userId = assertUserSignedIn(context);

        const query = gql`
          query {
            person(id: "${id}") {
              name
              id
              height
              eyeColor
            }
          }
        `;

        const { data } = await swClient.query({ query });
        if (!data.person) {
          throw new Error(`Could not find Star Wars character with id ${id}`);
        }

        await context.prisma.starredCharacter.create({
          data: {
            externalId: id,
            userId
          }
        });
      }
    });
  }
});
