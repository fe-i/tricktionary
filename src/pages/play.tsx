import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/button";
import Layout from "~/components/layout";
import Link from "~/components/link";
import Modal from "~/components/modal";
import { api } from "~/utils/api";
import autoAnimate from "@formkit/auto-animate";

const Play: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const parent = useRef<HTMLDivElement>(null);
  const existsMutation = api.room.exists.useMutation();

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
  useEffect(() => {
    parent.current && autoAnimate(parent.current, {});
  }, [parent]);

  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  const joinRoom = async () => {
    const codeVal = code.slice(1);
    const result = await existsMutation.mutateAsync({ roomCode: codeVal });
    console.log(result);
    if (result) {
      await router.push(`/room/${codeVal}`);
    }
  };

  return (
    <Layout title="Play">
      <Modal
        className="flex w-[22rem] flex-col items-center gap-4"
        ref={parent}
      >
        <h2 className="w-full text-center text-2xl font-semibold">
          {joining ? "JOIN A GAME" : "PLAY"}
        </h2>
        {joining && (
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
            className="w-64 rounded-lg border border-text bg-transparent p-3 text-center text-3xl font-bold"
          />
        )}

        <Button
          className="w-full text-xl font-semibold"
          disabled={joining && code.length != 5}
          onClick={joining ? joinRoom : () => setJoining(true)}
        >
          {joining ? "Go!" : "Join a room"}
        </Button>
        {!joining && (
          <>
            <div className="justify-apart flex w-full items-center gap-2">
              <hr className="w-full border-text" />
              <p>OR</p>
              <hr className="w-full border-text" />
            </div>
            <Button
              className="w-full text-xl font-semibold"
              onClick={async () => {
                await createMutation.mutateAsync();
              }}
            >
              Create a room
            </Button>
          </>
        )}

        <Link href="/how-to" variant="underlined">
          Learn to play →
        </Link>
      </Modal>
    </Layout>
  );
};

export default Play;
