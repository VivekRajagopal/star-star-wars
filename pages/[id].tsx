import gql from "graphql-tag";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import client from "../apollo/client";
import CharacterDetail from "../components/CharacterDetail";
import Layout from "../components/Page";
import { Character } from "../interfaces";
import { AuthContext, useAuthContext } from "../lib/AuthProvider";

const getCharacterQuery = gql`
  query GetCharacterQuery($id: String!) {
    character(id: $id) {
      id
      name
      height
      eyeColor
      isFavourite
    }
  }
`;

const starCharacterMutation = gql`
  mutation StarCharacterMutation($id: String!) {
    toggleCharacter(id: $id) {
      id
      name
      height
      eyeColor
      isFavourite
    }
  }
`;

async function getCharacter(accessToken: string, id: string) {
  const { data } = await client(accessToken).query<{ character: Character }>({
    query: getCharacterQuery,
    variables: { id }
  });

  return data.character;
}

async function toggleCharacter(accessToken: string, id: string) {
  const { data } = await client(accessToken).mutate<{ toggleCharacter: Character }>({
    mutation: starCharacterMutation,
    variables: { id }
  });

  return data?.toggleCharacter;
}

const CharacterDetailPage = () => {
  const { accessToken, setAccessToken } = useAuthContext();
  const [character, setCharacter] = useState<Character>();
  const [characterId, setCharacterId] = useState<string>();

  useEffect(() => {
    const characterId = Router.query.id as string;
    setCharacterId(characterId);
    accessToken && getCharacter(accessToken, characterId).then((dashboard) => setCharacter(dashboard));
  }, [accessToken]);

  if (!accessToken) {
    return <Link href="/auth/login">Login to see this Character</Link>;
  }

  if (!character || !characterId) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <Layout>
        <Link href="/" as={`/`}>
          <a>Back</a>
        </Link>

        <CharacterDetail character={character}></CharacterDetail>
        {character.isFavourite ? (
          <button
            className="btn btn-warning"
            onClick={async () => setCharacter(await toggleCharacter(accessToken, characterId))}
          >
            Unfavourite
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={async () => setCharacter(await toggleCharacter(accessToken, characterId))}
          >
            ⭐ Favourite
          </button>
        )}
      </Layout>
    </AuthContext.Provider>
  );
};

export default CharacterDetailPage;
