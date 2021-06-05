import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthProvider } from "../lib/AuthProvider";
import { AuthenticatedApolloProvider } from "../lib/useApolloClient";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthenticatedApolloProvider>
        <Component {...pageProps} />
      </AuthenticatedApolloProvider>
    </AuthProvider>
  );
}
