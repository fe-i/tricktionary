import Head from "next/head";
import { Header } from "~/components/layout";

const Layout: React.FC<React.PropsWithChildren<{ title?: string }>> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{`${title ? title + " | " : ""}Dictionary Game`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content={`${title ? title + " | " : ""}Dictionary Game`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://dictionary-game-silk.vercel.app"
        />
        <meta property="og:description" content="Dictionary Game" />
        {/* <meta property="og:image" content="" /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="flex min-h-screen flex-col">
        <Header />
        {children}
      </main>
    </>
  );
};

export default Layout;
