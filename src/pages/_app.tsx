import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component: PageComponent, pageProps }: AppProps) {
  return <PageComponent {...pageProps} />;
}
export default MyApp;
