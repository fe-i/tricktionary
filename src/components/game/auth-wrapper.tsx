import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export enum AuthStates {
  UNAUTHORIZED,
  LOADING,
  AUTHORIZED,
}

export const useAuth = (slug: string): AuthStates => {
  const joinMutation = api.room.join.useMutation();
  const sessionData = useSession();

  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug?.toString() ?? "",
  });

  if (sessionData.status === "unauthenticated") {
    // Not logged in
    return AuthStates.UNAUTHORIZED;
  }

  if (roomQuery.isLoading) {
    // Checking room exists
    return AuthStates.LOADING;
  } else if (!roomQuery.data) {
    // Room does not exist
    return AuthStates.UNAUTHORIZED;
  } else {
    // Room exists
    if (
      sessionData.status === "authenticated" &&
      sessionData.data?.user.roomCode !== slug
    ) {
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

        return AuthStates.LOADING;
      } else {
        // Part of another room, go home
        return AuthStates.UNAUTHORIZED;
      }
    }
  }

  return AuthStates.AUTHORIZED;
};
