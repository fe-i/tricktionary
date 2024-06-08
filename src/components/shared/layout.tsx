import Head from "next/head";
import { Header } from "~/components/shared/header";
import { cn } from "~/utils/cn";

const Layout: React.FC<
  React.PropsWithChildren<{
    title?: string;
    className?: string;
    noHeader?: boolean;
  }>
> = ({ title, className = "", noHeader = false, children }) => {
  return (
    <>
      <Head>
        <title>{`${title ? title + " | " : ""}Tricktionary`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content={`${title ? title + " | " : ""}Tricktionary`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://dictionary-game-silk.vercel.app"
        />
        <meta property="og:description" content="Tricktionary" />
        {/* <meta property="og:image" content="" /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className={cn(
          "container mb-4 mt-16 flex flex-col items-center justify-center gap-8 px-6 text-text",
          className,
        )}
      >
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

export { Layout };
