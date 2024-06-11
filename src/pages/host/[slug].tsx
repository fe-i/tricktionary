import { Layout } from "~/components/shared/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { AuthStates, useAuth } from "~/components/game/use-auth";
import { usePusher } from "~/pages/api/pusher/usePusher";
import { Leaderboard, Podium } from "~/components/ui/leaderboard";
import { BadgeCheck, Crown, Pencil, Vote, X } from "lucide-react";
import { useWindowSize } from "~/utils/use-window-size";
import QRCode from "react-qr-code";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";

const Host: React.FC = () => {
  const { isMobile } = useWindowSize();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const slug = router.query.slug?.toString() ?? "";

  const [editingGame, setEditingGame] = useState(false);

  const leaveMutation = api.room.leave.useMutation();

  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;

  const numUsersPlaying = roomData?.users
    ? roomData.users.length - (roomData.hostPlays ? 1 : 2)
    : 0;

  const shouldVote =
    roomData?.users.length &&
    roomData?.fakeDefinitions.length === numUsersPlaying;

  const countVotesQuery = api.definitions.countVotes.useQuery();
  const countVotes = countVotesQuery.data;
  const allVoted =
    roomData?.users.length &&
    countVotes?.length &&
    countVotes.length === numUsersPlaying;

  const resultsQuery = api.room.getRoundResults.useQuery();
  const results = resultsQuery.data;

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const updateMutation = api.room.update.useMutation();
  const startMutation = api.room.startGame.useMutation();

  const [rounds, setRounds] = useState(roomData?.rounds ?? 5);
  const authData = useAuth(slug, !!roomData, roomQuery.isLoading);

  const updateRoom: () => Promise<void> = async () => {
    await roomQuery.refetch();
    await countVotesQuery.refetch();
    await resultsQuery.refetch();
  };

  usePusher(slug, updateRoom);

  if (authData === AuthStates.UNAUTHORIZED) {
    void router.push("/");
    return <></>;
  } else if (authData === AuthStates.LOADING) {
    return <Layout>Loading...</Layout>;
  }

  if (sessionData?.user.id !== roomData?.hostId) {
    void router.push("/");
    return <></>;
  }

  const isOwner = sessionData?.user.id === roomData?.hostId;

  return (
    <Layout title={`Room ${slug} Host View`}>
      <div className="flex w-full flex-col items-center gap-8">
        <div className="mt-5 flex items-center justify-start gap-6">
          {!isMobile && !roomData?.playing && (
            <QRCode
              size={120}
              bgColor="transparent"
              value="https://tricktionary.vercel.app"
            />
          )}
          <div className="flex flex-col justify-between">
            <h1 className="text-7xl font-bold">#{slug}</h1>
            <p className="font-regular text-2xl">
              {roomData?.currentRound} of {roomData?.rounds} rounds •{" "}
              {roomData?.users.length} player
              {roomData?.users.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex w-3/5 flex-1 flex-col items-center justify-center rounded-md border border-text px-4 py-6 text-center">
          {roomData?.playing ? (
            <>
              <p className="mb-3 text-xl font-bold">
                {roomData?.word ?? "???"}
              </p>
              <p className="text-xl font-light">
                {results?.realDefinition ? "Real Definition Hidden" : "???"}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold">
                Start the game to get your first word!
              </p>
            </>
          )}
        </div>
        <div className="flex w-3/5 flex-wrap justify-end gap-2">
          {isOwner && (
            <>
              {!roomData?.playing && (
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
                      await updateRoom();
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
              <p className="text-slate-800">Enter a number between 3 and 10.</p>
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

        <hr className="my-2 w-full border-text" />
        {roomData?.playing && !shouldVote && (
          <p className="text-xl font-light">
            Fake Definitions: {roomData?.fakeDefinitions.length} of{" "}
            {roomData?.users.length && numUsersPlaying}
          </p>
        )}
        {roomData?.playing && !allVoted && (
          <p className="text-xl font-light">
            Votes: {countVotes?.length} of{" "}
            {roomData?.users.length && numUsersPlaying}
          </p>
        )}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {roomData?.users.map((player, _) => (
          <div
            className="pointer-events-none flex items-center gap-3 rounded-lg border border-text px-6 py-3 hover:border-red-600"
            key={_}
          >
            {player.id === roomData.hostId && <Crown />}
            <p className="text-lg">{player.name}</p>
            {roomData.playing && player.id === roomData.chooserId && (
              <BadgeCheck />
            )}
            {roomData.playing &&
              !(!roomData.hostPlays && player.id === roomData.hostId) &&
              player.id !== roomData.chooserId &&
              roomData.word &&
              !roomData.fakeDefinitions.find(
                (fd) => fd.userId === player.id,
              ) && <Pencil />}
            {roomData.playing &&
              shouldVote &&
              !(!roomData.hostPlays && player.id === roomData.hostId) &&
              player.id !== roomData.chooserId &&
              !countVotes?.find((v) => v.userId === player.id) && <Vote />}
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
      {roomData?.playing && (
        <div className="w-3/5">
          <Podium topFive={results?.topFive} />
          <Leaderboard topFive={results?.topFive} />
        </div>
      )}
    </Layout>
  );
};

export default Host;
