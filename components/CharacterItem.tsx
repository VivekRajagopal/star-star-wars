import Link from "next/link";
import React from "react";
import { Character } from "../interfaces";

type Props = {
  character: Character;
};

const CharacterItem = ({ character: data }: Props) => (
  <Link href="/[id]" as={`/${data.id}`}>
    <a>{data.name}</a>
  </Link>
);

export default CharacterItem;
