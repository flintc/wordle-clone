import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { GameProvider } from "../lib/game-context";
import Head from "next/head";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document?.querySelector("html")?.classList.add("dark-theme");
  }, []);
  return (
    <GameProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Component {...pageProps} />
    </GameProvider>
  );
}

export default MyApp;
