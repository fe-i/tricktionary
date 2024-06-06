import { Layout } from "~/components/ui/layout";
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
} from "~/components/game";
import { usePusher } from "~/pages/api/pusher/usePusher";

const Room: React.FC = () => {
  const sessionData = useSession();
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

  // const countVotesQuery = api.definitions.countVotes.useQuery();
  // const countVotes = countVotesQuery.data;
  // const allVoted =
  //   !shouldVote &&
  //   roomData?.users.length &&
  //   roomData?.users.length - 1 ===
  //     roomData?.correct_voters.length +
  //   countVotes?.length;

  const authData = useAuth(slug, !!roomData, roomQuery.isLoading);

  const updateRoom: () => Promise<void> = async () => {
    await roomQuery.refetch();
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
    if (sessionData.data?.user.id === roomData.chooserId) {
      return !roomData.word ? (
        <ChooseWord updateRoom={updateRoom} />
      ) : (
        <ChooserWait />
      );
    } else {
      if (!roomData.word) {
        return <WriterWaitForWord chooserId={roomData.chooserId ?? ""} />;
      }

      if (shouldVote) {
        return <Voting word={roomData.word} />;
      }

      if (!didWrite) {
        return <WriteFakes word={roomData.word} updateRoom={updateRoom} />;
      }

      // if (allVoted) {
      //   return <Results />;
      // }

      return <WriterWaitToVote />;
    }
  }
};

export default Room;
