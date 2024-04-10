import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/button";
import Layout from "~/components/layout";
import LinkButton from "~/components/link-button";
import Modal from "~/components/modal";

export default function Home() {
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
      <Modal className="flex max-w-[25rem] flex-col items-start gap-4">
        <h3 className="text-2xl font-bold">FICTIONARY</h3>
        <p>The game of weird words and wacky definitions!</p>
        <div className="flex w-full items-center justify-end gap-4">
          <LinkButton href="/how-to" variant="gray">
            Learn to play
          </LinkButton>
          <Button onClick={() => signIn("google")} variant="primary">
            Sign in
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

// const hello = api.post.hello.useQuery({ text: "from tRPC" });

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={
//           sessionData ? () => void signOut() : () => void signIn("google")
//         }
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
