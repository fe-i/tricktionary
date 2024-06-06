import PusherJS from "pusher-js";
import { env } from "~/env.js";
import * as superjson from "superjson";
import type { User } from "next-auth";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useToast } from "~/components/use-toast";
import { useSession } from "next-auth/react";

// This connects the client to pusher and listen for events
export const usePusher = (
  roomCode: string,
  refetchRoom: () => Promise<void>,
) => {
  const pusherRef = useRef<PusherJS>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: sessionData } = useSession();

  useEffect(() => {
    // Connect to pusher
    if (!pusherRef.current) {
      pusherRef.current = new PusherJS(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
        userAuthentication: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      });

      pusherRef.current.unsubscribe(roomCode);
      pusherRef.current.unbind_all();
      pusherRef.current.subscribe(roomCode);
      pusherRef.current.bind("updateRoom", async (d: { raw: string }) => {
        console.log("Recieved update message.");
        await refetchRoom();

        const data: {
          userId: string;
          redeemedAt: number;
          user: User;
          path?: string;
        } = superjson.parse(d.raw);

        if (data.path) {
          toast({
            title: `Room ${roomCode.toUpperCase()} Closed`,
            description: "Redirecting to home.",
          });
          console.log(
            `Room ${roomCode.toUpperCase()} closed, redirecting to home.`,
          );
          await router.push(data.path);
        }

        document.dispatchEvent(new Event("visibilitychange"));
        await refetchRoom();
      });
      pusherRef.current.bind("kick", async (d: { raw: string }) => {
        const data: {
          redeemedAt: number;
          kickeeId: string;
        } = superjson.parse(d.raw);

        if (sessionData?.user.id === data.kickeeId) {
          toast({
            title: `You have been removed from room ${roomCode.toUpperCase()}`,
            description: "Redirecting to home.",
          });
          await router.push("/");
        } else {
          await refetchRoom();
        }
      });
    }

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = undefined;
      }
    };
  }, [roomCode, router, refetchRoom, toast, sessionData?.user.id]);
};
