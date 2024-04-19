import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "~/components/button";
import Layout from "~/components/layout";
import Link from "~/components/link";
import Modal from "~/components/modal";
import { api } from "~/utils/api";

const Play: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();

  const createMutation = api.room.create.useMutation({
    onSuccess: async (r) => {
      if (r) {
        await router.push(`/room/${r.code}`);
      } else {
        console.log("You are already in a room!!");
      }
    },
  });

  const [code, setCode] = useState("");

  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  const joinRoom = async () => {
    // CHECK IF CODE EXISTS

    await router.push(`/room/${code.slice(1)}`);
  };

  return (
    <Layout>
      <Modal className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">JOIN A GAME</h2>
        <input
          type="text"
          placeholder="#ABCD"
          value={code}
          onChange={(e) => {
            let val = e.currentTarget.value;
            if (!val.startsWith("#")) {
              val = "#" + val;
              if (val.length === 6) {
                val = val.slice(0, 5);
              }
            }
            setCode(val.toUpperCase());
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") await joinRoom();
          }}
          onBlur={(e) => {
            if (e.currentTarget.value === "#") setCode("");
          }}
          maxLength={5}
          className="border-text w-64 rounded-lg border bg-transparent p-3 text-center text-3xl font-bold"
        />
        <Button
          className="w-full text-xl font-semibold"
          disabled={code.length != 5}
          onClick={joinRoom}
        >
          GO!
        </Button>
        <Button
          className="w-full text-xl font-semibold"
          onClick={async () => {
            await createMutation.mutateAsync();
          }}
        >
          Create a room
        </Button>
        <Link href="/how-to" variant="underlined">
          Learn to play →
        </Link>
      </Modal>
    </Layout>
  );
};

export default Play;
