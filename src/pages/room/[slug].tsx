import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/button";
import Layout from "~/components/layout";
import { cn } from "~/utils/cn";

import autoAnimate from "@formkit/auto-animate";

const Slug: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: sessionData } = useSession();
  const [editingGame, setEditingGame] = useState(false);

  // Query room using slug
  const { rounds, difficulty, players, hostId } = {
    rounds: 5,
    difficulty: "Medium",
    players: ["Santiago", "Fei", "Zhi Heng"],
    hostId: "abc",
  };

  const isOwner = true; //sessionData?.user.id === hostId;

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <Layout>
      <div className="flex w-full flex-col items-start justify-start gap-3 px-2 py-4">
        <div className="flex w-full flex-col items-start justify-start">
          <div className="flex w-full items-end gap-3">
            <div className="flex flex-1 flex-col gap-3">
              <h1 className="text-4xl font-bold">#{slug}</h1>
              <p className="text-lg font-medium">
                {rounds} rounds • {difficulty} difficulty • {players.length}{" "}
                players
              </p>
            </div>
            {isOwner ? (
              <>
                <Button
                  onClick={() => setEditingGame((p) => !p)}
                  variant="gray"
                  className="h-fit"
                >
                  {editingGame ? "Save Game" : "Edit Game"}
                </Button>
                <Button
                  onClick={() => console.log("Play")}
                  variant="primary"
                  className="h-fit"
                >
                  Play
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className={cn("overflow-hidden transition-all")} ref={parent}>
            {editingGame ? (
              <p className="text-5xl">
                sdhgjdsnfd
                <br /> jsfjdwnjfdj <br />{" "}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>

        <hr className="border-text my-2 w-full" />
        <div className="flex w-full flex-wrap justify-center gap-5">
          {players.map((player, i) => (
            <div
              className="border-text pointer-events-none flex items-center gap-3 rounded-lg border px-6 py-3 hover:border-red-600"
              key={i}
            >
              <p className="text-lg">{player}</p>
              {isOwner ? (
                <X
                  onClick={() => {
                    //Mutate room remove this player from the game
                    // make sure mutation only works for owner
                  }}
                  className="group pointer-events-auto cursor-pointer transition-all hover:scale-110 hover:text-red-500 active:scale-90"
                />
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Slug;
