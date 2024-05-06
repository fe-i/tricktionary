import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";

import { api } from "~/utils/api";
import { AuthStates, useAuth } from "~/components/game/use-auth";
import {
  ChooseWord,
  ChooserWait,
  Voting,
  WaitingRoom,
  WriteFakes,
  WriterWait,
} from "~/components/game";

const Slug: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();
  const slug = router.query.slug?.toString() ?? "";
  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;

  const authData = useAuth(slug);

  if (authData === AuthStates.UNAUTHORIZED) {
    void router.push("/");
    return <></>;
  } else if (authData === AuthStates.LOADING) {
    return <Layout>Loading...</Layout>;
  }

  if (!roomData?.playing) {
    return (
      <WaitingRoom
        onStart={async () => {
          await roomQuery.refetch();
        }}
      />
    );
  } else {
    if (sessionData.data?.user.id === roomData.chooserId) {
      return !roomData.definition ? <ChooseWord /> : <ChooserWait />;
    } else {
      return !roomData.definition ? (
        <WriterWait />
      ) : !roomData.fakeDefinitions.length ? (
        <WriteFakes />
      ) : (
        <Voting />
      );
    }
  }
};

export default Slug;
