import Head from "next/head";
import React, { ReactNode } from "react";
import { useAuthContext } from "../lib/AuthProvider";
import { SignoutLink } from "./SignoutLink";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Page = ({ children }: Props) => {
  const { isSignedIn } = useAuthContext();

  return (
    <div>
      <Head>
        <title>⭐ Star Wars</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="container mt-5">
        <header>
          <nav className="d-flex justify-content-end">{isSignedIn() && <SignoutLink />}</nav>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Page;
