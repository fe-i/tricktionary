import { signIn, signOut, useSession } from "next-auth/react";
// import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="flex w-screen items-center justify-between bg-white px-8 py-2 shadow">
      <Link href="/" className="flex gap-4">
        {/* <Image src="/" alt="" height={10} width={10} /> */}
        <h1>DG</h1>
      </Link>
      <button
        className="rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-200"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("google")
        }
      >
        {sessionData ? "Sign Out" : "Sign In"}
      </button>
    </header>
  );
};

export { Header };
