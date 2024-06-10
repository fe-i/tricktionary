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

const Host: React.FC = () => {
  const { isMobile } = useWindowSize();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const slug = router.query.slug?.toString() ?? "";

  const leaveMutation = api.room.leave.useMutation();

  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;

  const shouldVote =
    roomData?.users.length &&
    roomData?.users.length - 1 === roomData?.fakeDefinitions.length;

  const countVotesQuery = api.definitions.countVotes.useQuery();
  const countVotes = countVotesQuery.data;
  const allVoted =
    roomData?.users.length &&
    countVotes?.length &&
    roomData?.users.length - 1 === countVotes.length;

  const resultsQuery = api.room.getRoundResults.useQuery();
  const results = resultsQuery.data;

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
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center justify-center gap-6">
          {!isMobile && !roomData?.playing && (
            <QRCode
              size={160}
              bgColor="#abcdef"
              value="https://tricktionary.vercel.app"
            />
          )}
          <div className="flex flex-col justify-between">
            <h1 className="text-6xl font-bold">#{slug}</h1>
            <p className="text-lg font-medium">
              {roomData?.currentRound} of {roomData?.rounds} rounds •{" "}
              {roomData?.users.length} player
              {roomData?.users.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-text px-4 py-6 text-center">
          {/**ugly box */}
          <p className="mb-3 text-xl font-bold">{roomData?.word ?? "???"}</p>
          <p className="text-xl font-light">
            {results?.realDefinition ? "Real Definition Hidden" : "???"}
          </p>
        </div>
        {roomData?.playing && !shouldVote && (
          <p className="text-xl font-light">
            Fake Definitions: {roomData?.fakeDefinitions.length} of{" "}
            {roomData?.users.length && roomData?.users.length - 1}
          </p>
        )}
        {roomData?.playing && !allVoted && (
          <p className="text-xl font-light">
            Votes: {countVotes?.length} of{" "}
            {roomData?.users.length && roomData?.users.length - 1}
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
              player.id !== roomData.chooserId &&
              roomData.word &&
              !roomData.fakeDefinitions.find(
                (fd) => fd.userId === player.id,
              ) && <Pencil />}
            {roomData.playing &&
              shouldVote &&
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
        <div className="border border-text">
          <Podium topFive={results?.topFive} />
          <Leaderboard topFive={results?.topFive} />
        </div>
      )}
    </Layout>
  );
};

export default Host;
