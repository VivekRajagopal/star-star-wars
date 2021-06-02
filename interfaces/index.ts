export type User = {
  id: number;
  username: string | null;
  starredCharacters: {
    id: string;
    name: string;
  }[];
};

export type Character = {
  id: string;
  name: string;
  height: number;
  eyeColor: string;
  isFavourite: boolean;
};

export type Dashboard = {
  user: User;
  characters: Character[];
};
