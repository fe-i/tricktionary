import { signIn, signOut, useSession } from "next-auth/react";
import UnderlineHover from "./underline-hover";
import Button from "./button";
import Link from "./link";
// import Image from "next/image";

const Header: React.FC = () => {
  const { status } = useSession();

  return (
    <header className="container absolute left-auto right-auto top-0 z-50 flex justify-between px-6 py-6">
      <Link href="/" variant="getBolder">
        FICTIONARY
      </Link>
      <UnderlineHover>
        <Button
          variant="blank"
          className="p-0"
          onClick={
            status === "authenticated"
              ? () => signOut()
              : () => signIn("google")
          }
        >
          {status === "authenticated" ? "SIGN OUT" : "SIGN IN"}
        </Button>
      </UnderlineHover>
    </header>
  );
};

export { Header };
