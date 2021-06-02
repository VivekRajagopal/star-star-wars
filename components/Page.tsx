import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children }: Props) => (
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
    <body className="container mt-5">
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{" "}
        </nav>
      </header>
      {children}
    </body>
  </div>
);

export default Layout;
