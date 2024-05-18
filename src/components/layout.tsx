import Head from "next/head";
import { Header } from "./ui/header";

const Layout: React.FC<
  React.PropsWithChildren<{ title?: string; noHeader?: boolean }>
> = ({ title, noHeader = false, children }) => {
  return (
    <>
      <Head>
        <title>{`${title ? title + " | " : ""}Fictionary`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content={`${title ? title + " | " : ""}Fictionary`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://dictionary-game-silk.vercel.app"
        />
        <meta property="og:description" content="Fictionary" />
        {/* <meta property="og:image" content="" /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="container flex flex-col items-center justify-center gap-8 px-6 py-16 text-text">
        <svg className="fixed left-0 top-0 -z-10 h-full w-full">
          <filter id="roughpaper" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="10"
            />
            <feDiffuseLighting lightingColor="#EFEFEF" surfaceScale="1.5">
              <feDistantLight azimuth="60" elevation="65" />
            </feDiffuseLighting>
          </filter>
          <rect width="100%" height="100%" filter="url(#roughpaper)" />
        </svg>

        {!noHeader && <Header />}
        {children}
      </div>
    </>
  );
};

export default Layout;
