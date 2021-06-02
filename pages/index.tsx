import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Welcome to (Star) Star Wars!</h1>

    <Link href="/auth/login">
      <a>About</a>
    </Link>
  </Layout>
);

export default IndexPage;
