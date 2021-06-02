import gql from "graphql-tag";
import Link from "next/link";
import { useEffect, useState } from "react";
import client from "../apollo/client";
import { AuthContext, useAuthContext } from "../lib/AuthProvider";
import Layout from "../components/Page";
import CharacterList from "../components/CharacterList";
import { Dashboard } from "../interfaces";

async function getMyDashboard(accessToken: string) {
  const { data } = await client(accessToken).query<{ dashboard: Dashboard }>({
    context: {},
    query: gql`
      query {
        dashboard {
          user {
            id
            starredCharacters {
              id
              name
            }
          }
          characters {
            id
            name
            height
            eyeColor
          }
        }
      }
    `
  });

  return data.dashboard;
}

const MyDashboard = ({ accessToken }: { accessToken: string }) => {
  const [dashboard, setDashboard] = useState<Dashboard>();

  useEffect(() => {
    getMyDashboard(accessToken).then((dashboard) => setDashboard(dashboard));
  }, []);

  if (!dashboard) {
    return <></>;
  }

  return (
    <>
      <h4>My Favourite Characters</h4>
      {dashboard.user.starredCharacters.length === 0 ? (
        <span>Check out some characters below and favourite them</span>
      ) : (
        dashboard.user.starredCharacters.map(({ name, id }) => (
          <Link href="/[id]" as={`/${id}`}>
            <a className="p-2">{name}</a>
          </Link>
        ))
      )}
      <hr />
      <h4>All Characters</h4>
      <CharacterList characters={dashboard?.characters} />
    </>
  );
};

const LoginOrSignup = () => (
  <>
    <Link href="/auth/login">
      <a>Login</a>
    </Link>
    <span style={{ padding: "0 0.5rem" }}>or</span>
    <Link href="/auth/signup">
      <a>Signup</a>
    </Link>
  </>
);

const IndexPage = () => {
  const { accessToken, setAccessToken } = useAuthContext();
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <Layout title="Home | Next.js + TypeScript Example">
        <h1>Welcome to (Star) Star Wars!</h1>
        {accessToken ? <MyDashboard accessToken={accessToken} /> : <LoginOrSignup />}
      </Layout>
    </AuthContext.Provider>
  );
};

export default IndexPage;
