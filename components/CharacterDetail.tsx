import React from "react";
import { Character } from "../interfaces";

type Props = {
  character: Character;
};

const CharacterDetail = ({ character }: Props) => (
  <div>
    <h2>{character.name}</h2>
    <div>
      <span>Height: </span>
      <strong>{character.height} cm</strong>
    </div>
    <div>
      <span>Eye Color: </span>
      <strong>{character.eyeColor}</strong>
    </div>
  </div>
);

export default CharacterDetail;
