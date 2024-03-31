import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/button";
import Layout from "~/components/layout";
import Link from "~/components/link";
import Modal from "~/components/modal";

const Play: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  return (
    <Layout>
      <Modal className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">JOIN A GAME</h2>
        <input
          type="text"
          placeholder="#ABCD"
          className="border-text w-64 rounded-lg border bg-transparent p-3 text-center text-3xl font-bold"
        />
        <Link href="/how-to" variant="underlined">
          Learn to play →
        </Link>
      </Modal>
    </Layout>
  );
};

export default Play;
