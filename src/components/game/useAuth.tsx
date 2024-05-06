import { useRouter } from "next/router";
import Layout from "../layout";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export const AuthWrapper: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ slug, children }) => {
  const joinMutation = api.room.join.useMutation();
  const sessionData = useSession();
  const router = useRouter();

  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug?.toString() ?? "",
  });

  if (sessionData.status === "unauthenticated") {
    // Not logged in
    void router.push("/");
    return <></>;
  }

  if (roomQuery.isLoading) {
    // Checking room exists
    return <Layout>Loading</Layout>;
  } else if (!roomQuery.data) {
    // Room does not exist
    void router.push("/");
    return <></>;
  } else {
    // Room exists
    if (
      sessionData.status === "authenticated" &&
      sessionData.data?.user.roomCode !== slug
    ) {
      console.log(sessionData.data?.user.roomCode);
      // Logged in, not part of this room
      if (sessionData.data?.user.roomCode === null) {
        if (!joinMutation.isPending) {
          // Not part of any room, join this room
          joinMutation
            .mutateAsync({ roomCode: slug?.toString() ?? "" })
            .then(async () => {
              await sessionData.update();
            })
            .catch(() => 0);
        }

        return <Layout>Loading</Layout>;
      } else {
        // Part of another room, go home
        void router.push("/");
        return <></>;
      }
    }
  }

  return children;
};
