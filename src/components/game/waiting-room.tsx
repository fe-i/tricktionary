import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "~/components/ui/layout";
import { Button } from "~/components/button";
import type { RoomWithUsers } from "~/pages/room/[slug]";
import autoAnimate from "@formkit/auto-animate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select";
import { api } from "~/utils/api";

const WaitingRoom: React.FC<{
  onStart: () => Promise<void>;
  roomData: RoomWithUsers;
}> = ({ onStart, roomData }) => {
  const sessionData = useSession();
  const router = useRouter();
  const slug = router.query.slug?.toString() ?? "";

  const updateMutation = api.room.update.useMutation();
  const startMutation = api.room.startGame.useMutation();
  const leaveMutation = api.room.leave.useMutation();

  const leaveRoom = async () => {
    const result = await leaveMutation.mutateAsync();
    if (result) {
      await sessionData.update();
      await router.push("/");
    }
  };

  const [editingGame, setEditingGame] = useState(false);

  const parent = useRef(null);

  type difficulties = "Easy" | "Medium" | "Hard";
  const [difficulty, setDifficulty] = useState<difficulties>(
    (roomData?.difficulty as difficulties) ?? "Medium",
  );
  const [rounds, setRounds] = useState(roomData?.rounds ?? 5);

  const isOwner = sessionData.data?.user.id === roomData?.hostId;

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (!roomData) return;
    setDifficulty(roomData.difficulty as difficulties);
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
                {rounds} rounds • {difficulty} difficulty •{" "}
                {roomData?.users.length} player
                {roomData?.users.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button variant="danger" className="h-fit" onClick={leaveRoom}>
              Leave Room
            </Button>
            {isOwner && (
              <>
                <Button
                  onClick={async () => {
                    if (editingGame === true) {
                      await updateMutation.mutateAsync({
                        difficulty,
                        rounds,
                      });
                      // PUSHER
                    }
                    setEditingGame((p) => !p);
                  }}
                  variant={editingGame ? "primary" : "gray"}
                  className="h-fit"
                >
                  {editingGame ? "Save Game" : "Edit Game"}
                </Button>
                <Button
                  onClick={async () => {
                    await startMutation.mutateAsync();
                    await onStart();
                    // PUSHER
                  }}
                  variant="primary"
                  className="h-fit"
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
          <div
            className="mt-6 flex flex-col items-start justify-start gap-1 overflow-hidden transition-all"
            ref={parent}
          >
            {editingGame ? (
              <>
                <h3 className="text-lg font-medium">Rounds:</h3>
                <p>Enter a number of rounds between 3 and 10</p>
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
                    setRounds(parseInt(e.currentTarget.value)); // MUTATE ROOM HERE
                  }}
                />
                <h3 className="mt-4 text-lg font-medium">Difficulty:</h3>
                <Select
                  defaultValue="Medium"
                  onValueChange={(value) => {
                    setDifficulty(value as difficulties); // MUTATE ROOM HERE
                  }}
                >
                  <SelectTrigger className="w-44 outline-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        <hr className="my-2 w-full border-text" />
        <div className="flex w-full flex-wrap justify-center gap-5">
          {roomData?.users.map((player, i) => (
            <div
              className="pointer-events-none flex items-center gap-3 rounded-lg border border-text px-6 py-3 hover:border-red-600"
              key={i}
            >
              <p className="text-lg">{player.name}</p>
              {isOwner && player.id !== roomData?.hostId ? (
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

export default WaitingRoom;
