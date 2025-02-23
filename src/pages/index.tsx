import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "~/components/shared/layout";
import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";

const Home: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();
  if (sessionData.status === "authenticated") {
    void router.push("/play");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  return (
    <Layout>
      <Modal className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">TRICKTIONARY</h3>
        <p>The game of weird words and wacky definitions!</p>
        <div className="flex w-full items-center justify-end gap-4">
          <Button onClick={() => void router.push("/how-to")} variant="gray">
            Learn to Play
          </Button>
          <Button onClick={() => signIn("google")} variant="primary">
            Sign In
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;
