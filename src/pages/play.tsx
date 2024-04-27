import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/button";
import Layout from "~/components/layout";
import Link from "~/components/link";
import Modal from "~/components/modal";
import { api } from "~/utils/api";
import autoAnimate from "@formkit/auto-animate";
import { useToast } from "~/components/use-toast";

const Play: React.FC = () => {
  // HOOKS
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // STATE, REFS, & EFFECTS
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState("");

  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current, {});
  }, [parent]);

  // MUTATIONS
  const existsMutation = api.room.exists.useMutation();
  const createMutation = api.room.create.useMutation();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  // JOIN & CREATE FUNCTIONS
  const joinRoom = async () => {
    const codeVal = code.slice(1);
    const result = await existsMutation.mutateAsync({ roomCode: codeVal });
    if (result) {
      await router.push(`/room/${codeVal}`);
    } else {
      toast({
        title: "Room Not Found",
        description: "Be sure to check your room code!",
      });
    }
  };

  const createRoom = async () => {
    const result = await createMutation.mutateAsync();
    if (result) {
      await router.push(`/room/${result.code}`);
    } else {
      toast({
        title: "Already in a room!",
        description: "Leave your current room before creating a new one.",
      });
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
              onClick={createRoom}
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
