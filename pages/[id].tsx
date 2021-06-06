import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DASHBOARD } from ".";
import CharacterDetail from "../components/CharacterDetail";
import Page from "../components/Page";
import { Character } from "../interfaces";
import { requireAuth } from "../lib/requireAuth";

const GET_CHARACTER = gql`
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

const TOGGLE_CHARACTER = gql`
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

const CharacterDetailPage = () => {
  requireAuth();

  const router = useRouter();
  const [characterId, setCharacterId] = useState<string | undefined>(undefined);

  const { data, updateQuery } = useQuery<{ character: Character }>(GET_CHARACTER, {
    variables: { id: router.query.id }
  });

  const [toggleCharacter, { loading: isToggleLoading }] = useMutation<{ toggleCharacter: Character }>(
    TOGGLE_CHARACTER,
    {
      variables: { id: characterId },
      onCompleted: ({ toggleCharacter }) =>
        updateQuery(() => {
          return { character: toggleCharacter };
        }),
      refetchQueries: [{ query: DASHBOARD }]
    }
  );

  useEffect(() => {
    const characterId = router.query.id as string | undefined;
    setCharacterId(characterId);
  }, [router]);

  if (!data || !characterId) {
    return <></>;
  }

  return (
    <Page>
      <Link href="/" as={`/`}>
        <a>Back</a>
      </Link>
      <hr />
      <CharacterDetail character={data.character}></CharacterDetail>
      {data.character.isFavourite ? (
        <button
          className="btn btn-warning my-5"
          disabled={isToggleLoading}
          onClick={async () => await toggleCharacter()}
        >
          Unfavourite
        </button>
      ) : (
        <button
          className="btn btn-primary my-5"
          disabled={isToggleLoading}
          onClick={async () => await toggleCharacter()}
        >
          ⭐ Favourite
        </button>
      )}
    </Page>
  );
};

export default CharacterDetailPage;
