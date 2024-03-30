import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/button";
import Layout from "~/components/layout";

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
      Polay the game <Button onClick={() => signOut()}>Sign out</Button>
    </Layout>
  );
};

export default Play;
