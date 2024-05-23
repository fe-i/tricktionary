import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import type { Prisma } from "@prisma/client";
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

export type RoomWithUsers =
  | Prisma.RoomGetPayload<{
      select: { word: true };
      include: { users: { select: { id: true; name: true; image: true } } };
    }>
  | undefined
  | null;

const Slug: React.FC = () => {
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
    roomData?.fakeDefinitions.length === roomData?.users.length;

  const authData = useAuth(slug, roomData, roomQuery.isLoading);

  const updateRoom: () => Promise<void> = async () => {
    await roomQuery.refetch();
  };

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
      return !roomData.definition ? (
        <ChooseWord updateRoom={updateRoom} />
      ) : (
        <ChooserWait />
      );
    } else {
      if (!roomData.definition) {
        return <WriterWaitForWord roomData={roomData} />;
      }

      if (shouldVote) {
        return <Voting />;
      }

      if (!didWrite) {
        return <WriteFakes roomData={roomData} />;
      }

      return <WriterWaitToVote roomData={roomData} />;
    }
  }
};

export default Slug;
