import { GetStaticProps } from "next";
import Link from "next/link";

import { User } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import Layout from "../../components/Layout";
import List from "../../components/List";
import client from "../../apollo/client";
import gql from "graphql-tag";

type Props = {
  // items: User[];
  users: { id: string }[];
};

export async function getServerSideProps(): Promise<{ props: Props }> {
  console.log("Testononi");

  const { data } = await client.query<{ id: string }[]>({
    query: gql`
      query {
        Users {
          id
        }
      }
    `
  });

  return { props: { users: data } };
}

const Users = ({ users }: Props) => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <h1>Users List</h1>
    <p>
      Example fetching data from inside <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /users</p>
    <pre>{JSON.stringify(users)}</pre>
  </Layout>
);

export default Users;
