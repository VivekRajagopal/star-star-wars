import gql from "graphql-tag";
import Router from "next/router";
import React, { useState } from "react";
import { useAuthContext } from "../../lib/AuthProvider";
import Page from "../../components/Page";
import { useMutation } from "@apollo/client";
import { AuthPayload } from "../../interfaces";

const SIGNUP_USER = gql`
  mutation SignupUserMutation($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
      token
    }
  }
`;

function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAccessToken } = useAuthContext();

  const [signupUser, { loading: isSignupPending }] = useMutation<{ signupUser: AuthPayload }>(SIGNUP_USER, {
    onCompleted: ({ signupUser }) => {
      setAccessToken(signupUser.token);
      Router.push("/");
    }
  });

  return (
    <Page>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await signupUser({
              variables: {
                email,
                password
              }
            });
          }}
        >
          <h1>Signup</h1>
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="text" value={email} />
          <input
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <button className="btn btn-primary" disabled={!password || !email || isSignupPending} type="submit">
            Sign Up
          </button>
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Page>
  );
}

export default signup;
