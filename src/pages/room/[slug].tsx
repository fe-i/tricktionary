import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";

import { api } from "~/utils/api";
import { AuthStates, useAuth } from "~/components/game/auth-wrapper";
import WaitingRoom from "~/components/game/waiting-room";

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
    return <WaitingRoom />;
  } else {
  }
};

export default Slug;
