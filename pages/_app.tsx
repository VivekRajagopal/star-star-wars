import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthProvider } from "../lib/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
