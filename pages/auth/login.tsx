import React, { useState } from "react";
import Layout from "../../components/Layout";
import Router from "next/router";
import gql from "graphql-tag";
import client from "../../apollo/client";

const loginMutation = gql`
  mutation LoginUserMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [login] = useMutation(loginMutation);

  const login = async () => {
    const result = await client.mutate({ mutation: loginMutation, variables: { email, password } });
    console.log(result);
    Router.push("/");
  };

  return (
    <Layout>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("submit", password, email);

            await login();
          }}
        >
          <h1>Login</h1>
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="text" value={email} />
          <input
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input disabled={!password || !email} type="submit" value="Login" />
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
    </Layout>
  );
}

export default login;
// export default withApollo(login);