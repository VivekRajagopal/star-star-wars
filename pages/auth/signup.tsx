import React, { useState } from "react";
import Router from "next/router";
import gql from "graphql-tag";
import client from "../../apollo/client";
import Layout from "../../components/Layout";

const signupMutation = gql`
  mutation SignupUserMutation($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
      token
      id
      email
      username
    }
  }
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [signup] = useMutation(signupMutation);

  const signup = async () => {
    const result = await client.mutate({ mutation: signupMutation, variables: { email, password } });
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

            await signup();
          }}
        >
          <h1>Signup user</h1>
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="text" value={email} />
          <input
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input disabled={!password || !email} type="submit" value="Signup" />
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

export default Signup;
// export default withApollo(Signup);
