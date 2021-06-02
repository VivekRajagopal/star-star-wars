import * as React from "react";
import { Character } from "../interfaces";
import CharacterItem from "./CharacterItem";

type Props = {
  characters: Character[];
};

const CharacterList = ({ characters: items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <CharacterItem character={item} />
      </li>
    ))}
  </ul>
);

export default CharacterList;
