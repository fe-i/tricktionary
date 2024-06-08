import { Layout } from "~/components/shared/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { AuthStates, useAuth } from "~/components/game/use-auth";
import {
  ChooseWord,
  ChooserWait,
  Voting,
  WaitingRoom,
  WriteFakes,
  WriterWaitToVote,
  WriterWaitForWord,
  RoundResults,
} from "~/components/game";
import { usePusher } from "~/pages/api/pusher/usePusher";

const Room: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const slug = router.query.slug?.toString() ?? "";

  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;

  const didWriteQuery = api.user.didWriteDefinition.useQuery();
  const didWrite = didWriteQuery.data;

  const shouldVote =
    roomData?.users.length &&
    roomData?.users.length - 1 === roomData?.fakeDefinitions.length;

  const countVotesQuery = api.definitions.countVotes.useQuery();
  const countVotes = countVotesQuery.data;
  const allVoted =
    roomData?.users.length &&
    countVotes?.length &&
    roomData?.users.length - 1 === countVotes.length;

  const authData = useAuth(slug, !!roomData, roomQuery.isLoading);

  const updateRoom: () => Promise<void> = async () => {
    await roomQuery.refetch();
    await countVotesQuery.refetch();
    await didWriteQuery.refetch();
  };

  usePusher(slug, updateRoom);

  if (authData === AuthStates.UNAUTHORIZED) {
    void router.push("/");
    return <></>;
  } else if (authData === AuthStates.LOADING) {
    return <Layout>Loading...</Layout>;
  }

  if (!roomData?.playing) {
    return <WaitingRoom roomData={roomData} onStart={updateRoom} />;
  } else {
    if (sessionData?.user.id === roomData.chooserId) {
      if (!roomData.word) {
        return <ChooseWord updateRoom={updateRoom} />;
      }

      if (allVoted) {
        return (
          <RoundResults
            currentRound={roomData.currentRound}
            isHost={sessionData?.user.id === roomData.hostId}
            isChooser
          />
        );
      }

      return <ChooserWait />;
    } else {
      if (!roomData.word) {
        return <WriterWaitForWord chooserId={roomData.chooserId ?? ""} />;
      }

      if (allVoted) {
        return (
          <RoundResults
            currentRound={roomData.currentRound}
            isHost={sessionData?.user.id === roomData.hostId}
          />
        );
      }

      if (shouldVote) {
        return <Voting word={roomData.word} />;
      }

      if (!didWrite) {
        return <WriteFakes word={roomData.word} updateRoom={updateRoom} />;
      }

      return <WriterWaitToVote />;
    }
  }
};

export default Room;
