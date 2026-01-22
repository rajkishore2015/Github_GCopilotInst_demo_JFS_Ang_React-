export type User = {
  id: number;
  name: string;
  email: string;
  age: number | null;
};

export type UserCreate = {
  name: string;
  email: string;
  age: number | null;
};

export type UserUpdate = UserCreate;
