import type { AppProps } from "next/app";
import { useEffect } from "react";
import { GameProvider } from "../lib/game-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document?.querySelector("html")?.classList.add("dark-theme");
  }, []);
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  );
}

export default MyApp;
