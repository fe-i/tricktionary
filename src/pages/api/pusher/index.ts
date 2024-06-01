import Pusher from "pusher";
import { env } from "~/env.js";
import * as superjson from "superjson";
import type { User } from "next-auth";

export const pusherPush = new Pusher({
  appId: env.PUSHER_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export const updateRoomData = async (
  roomId: string,
  user: User,
  redirect?: string,
) => {
  console.log(
    "sending update room message" + redirect
      ? `and redirecting to ${redirect}`
      : "",
  );
  await pusherPush.trigger(roomId, "updateRoom", {
    raw: superjson.stringify({
      userId: user.id,
      redeemedAt: Date.now(),
      user: user,
      path: redirect,
    }),
  });
};
