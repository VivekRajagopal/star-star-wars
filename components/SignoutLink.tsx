import Link from "next/link";
import React from "react";
import { useAuthContext } from "../lib/AuthProvider";

export const SignoutLink = () => {
  const { unsetAccessToken } = useAuthContext();

  return (
    <Link href="/">
      <button className="btn btn-sm btn-outline-danger" onClick={unsetAccessToken}>
        Signout
      </button>
    </Link>
  );
};
