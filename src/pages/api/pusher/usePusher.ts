import PusherJS from "pusher-js";
import { env } from "~/env.js";
import * as superjson from "superjson";
import type { User } from "next-auth";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const usePusher = (
  roomCode: string,
  invalidate: () => Promise<void>,
) => {
  const pusherRef = useRef<PusherJS>();
  const router = useRouter();

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
      pusherRef.current.bind("invalidate", async (d: { raw: string }) => {
        console.log("Recieved invalidate message");
        await invalidate();

        const data: {
          userId: string;
          redeemedAt: number;
          user: User;
          path?: string;
        } = superjson.parse(d.raw);
        if (data.path) {
          //   toast({
          //     title: `Room ${id.toUpperCase()} closed`,
          //     description: "Redirecting to home",
          //   });
          console.log(`Room ${roomCode} close, redirecting to home`);
          await router.push(data.path);
        }

        document.dispatchEvent(new Event("visibilitychange"));
        await invalidate();
      });
    }

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = undefined;
      }
    };
  }, [roomCode, router, invalidate]);
};
