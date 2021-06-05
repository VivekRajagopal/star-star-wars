import { ApolloClient, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "next/link";
import CharacterList from "../components/CharacterList";
import Page from "../components/Page";
import { Dashboard } from "../interfaces";
import { useAuthContext } from "../lib/AuthProvider";

export const DASHBOARD = gql`
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
`;

const MyDashboard = () => {
  const { data } = useQuery<{ dashboard: Dashboard }>(DASHBOARD);

  if (!data) {
    return <></>;
  }

  const { dashboard } = data;

  return (
    <>
      <h4>My Favourite Characters</h4>
      {dashboard.user.starredCharacters.length === 0 ? (
        <span>Check out some characters below and favourite them</span>
      ) : (
        dashboard.user.starredCharacters.map(({ name, id }) => (
          <Link key={id} href="/[id]" as={`/${id}`}>
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
  <div>
    <Link href="/auth/login">
      <a>Login</a>
    </Link>
    <span style={{ padding: "0 0.5rem" }}>or</span>
    <Link href="/auth/signup">
      <a>Signup</a>
    </Link>
  </div>
);

const IndexPage = () => {
  const { isSignedIn } = useAuthContext();

  return (
    <Page>
      <h1>Welcome to (Star) Star Wars!</h1>
      {isSignedIn() ? <MyDashboard /> : <LoginOrSignup />}
    </Page>
  );
};

export default IndexPage;
