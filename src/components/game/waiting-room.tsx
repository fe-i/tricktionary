import { Crown, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "~/components/shared/layout";
import { Button } from "~/components/ui/button";
import autoAnimate from "@formkit/auto-animate";
import { api } from "~/utils/api";
import type { Prisma } from "@prisma/client";
import { useToast } from "~/components/ui/use-toast";

type RoomDataType =
  | Omit<
      Prisma.RoomGetPayload<{
        select: { word: true };
        include: { users: { select: { id: true; name: true; image: true } } };
      }>,
      "definition"
    >
  | undefined
  | null;

const WaitingRoom: React.FC<{
  onStart: () => Promise<void>;
  roomData: RoomDataType;
}> = ({ onStart, roomData }) => {
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const slug = router.query.slug?.toString() ?? "";

  const updateMutation = api.room.update.useMutation();
  const startMutation = api.room.startGame.useMutation();
  const leaveMutation = api.room.leave.useMutation();

  const leaveRoom = async () => {
    const result = await leaveMutation.mutateAsync();

    if (result) {
      await router.push("/");
      await sessionData.update();
      toast({
        title: "Room Exited",
        description: "You successfully left the room.",
      });
    }
  };

  const [editingGame, setEditingGame] = useState(false);

  const parent = useRef(null);

  const [rounds, setRounds] = useState(roomData?.rounds ?? 5);

  const isOwner = sessionData.data?.user.id === roomData?.hostId;

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (!roomData) return;
    setRounds(roomData.rounds);
  }, [roomData]);

  return (
    <Layout>
      <div className="flex w-full flex-col items-start justify-start gap-3 px-2 py-4">
        <div className="flex w-full flex-col items-start justify-start">
          <div className="flex w-full items-end gap-3">
            <div className="flex flex-1 flex-col gap-3">
              <h1 className="text-4xl font-bold">#{slug}</h1>
              <p className="text-lg font-medium">
                {rounds} rounds • {roomData?.users.length} player
                {roomData?.users.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="danger" onClick={leaveRoom}>
                Leave Room
              </Button>
              {isOwner && (
                <>
                  <Button
                    onClick={async () => {
                      if (editingGame) {
                        await updateMutation.mutateAsync({
                          rounds,
                        });
                      }
                      setEditingGame((p) => !p);
                    }}
                    variant={editingGame ? "primary" : "gray"}
                  >
                    {editingGame ? "Save Game" : "Edit Game"}
                  </Button>
                  <Button
                    onClick={async () => {
                      await startMutation.mutateAsync();
                      await onStart();
                    }}
                    variant="primary"
                    disabled={
                      editingGame ||
                      (roomData?.users && roomData?.users.length < 3)
                    }
                  >
                    Play
                  </Button>
                </>
              )}
            </div>
          </div>
          <div
            className="mt-6 flex flex-col items-start justify-start gap-1 overflow-hidden transition-all"
            ref={parent}
          >
            {editingGame ? (
              <>
                <h3 className="text-lg font-medium">Rounds:</h3>
                <p className="text-slate-800">
                  Enter a number between 3 and 10.
                </p>
                <input
                  type="number"
                  className="w-44 rounded-md bg-background px-4 py-2 outline-none"
                  min={3}
                  max={10}
                  defaultValue={rounds}
                  onBlur={(e) => {
                    const val = parseInt(e.currentTarget.value);
                    if (val > 10) {
                      e.currentTarget.value = "10";
                    } else if (val < 3) {
                      e.currentTarget.value = "3";
                    }
                    setRounds(parseInt(e.currentTarget.value));
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <hr className="my-2 w-full border-text" />
        <div className="flex w-full flex-wrap justify-center gap-5">
          {roomData?.users.map((player, _) => (
            <div
              className="pointer-events-none flex items-center gap-3 rounded-lg border border-text px-6 py-3 hover:border-red-600"
              key={_}
            >
              {player.id === roomData.hostId && <Crown />}
              <p className="text-lg">{player.name}</p>
              {isOwner && player.id !== roomData?.hostId ? (
                <X
                  onClick={async () =>
                    await leaveMutation.mutateAsync({ id: player.id })
                  }
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

export default WaitingRoom;
