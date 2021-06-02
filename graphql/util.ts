import { verify } from "jsonwebtoken";
import { Context } from "./context";

type Token = {
  sub: string;
  iat: number;
  email: string;
};

export const getUserId = (context: Context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const verifiedToken = verify(token, process.env.JWT_SIGNING_KEY) as Token;
    return verifiedToken && Number(verifiedToken.sub);
  }
};

export const assertUserSignedIn = (context: Context) => {
  const userId = getUserId(context);

  if (userId === undefined) {
    throw Error("Invalid authentication.");
  }

  return userId;
};
