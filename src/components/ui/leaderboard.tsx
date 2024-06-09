import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";

const positions: Record<number, string> = {
  0: "1st",
  1: "2nd",
  2: "3rd",
  3: "4th",
  4: "5th",
};

const Podium: React.FC<{
  topFive?: {
    name: string | null;
    image: string | null;
    score: number;
    titleId: number | null;
  }[];
}> = ({ topFive }) => {
  return (
    <div className="grid h-52 grid-flow-col-dense content-end items-end justify-center gap-2">
      {topFive?.map((player, _) => (
        <PodiumStep player={player} position={_} key={_} />
      ))}
    </div>
  );
};

const PodiumStep: React.FC<{
  position: number;
  player: {
    name: string | null;
    image: string | null;
    score: number;
    titleId: number | null;
  };
}> = ({ position, player }) => {
  return (
    <div className="flex flex-col justify-center">
      <motion.div
        custom={position}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            delay: 0.75 * (5 - position),
            duration: 0.75,
            ease: "backInOut",
          },
        }}
        className="mb-2 self-center"
      >
        <Avatar className="h-11 w-11 overflow-hidden shadow-sm">
          {player.image && <AvatarImage src={player.image} />}
          <AvatarFallback>{player.name?.at(0)}</AvatarFallback>
        </Avatar>
      </motion.div>
      <motion.div
        custom={position}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          height: 150 * ((5 - position) / 5),
          opacity: 1,
          transition: {
            delay: 0.75 * (5 - position),
            duration: 0.75,
          },
        }}
        className="flex w-14 justify-center rounded-t-xl border-secondary bg-primary shadow transition-all hover:bg-primary/90 sm:w-16"
      >
        <p className="flex flex-col gap-4 self-end font-semibold text-white">
          {position === 0 && <Medal strokeWidth={1.5} />}
          {positions[position]}
        </p>
      </motion.div>
    </div>
  );
};

const Leaderboard: React.FC<{
  topFive?: {
    name: string | null;
    image: string | null;
    score: number;
    titleId: number | null;
  }[];
}> = ({ topFive }) => {
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      <h1 className="font-bold">Leaderboard</h1>
      <div className="flex w-full flex-col gap-4">
        {topFive?.map((player, _) => (
          <LeaderboardCard player={player} position={_} key={_} />
        ))}
      </div>
    </div>
  );
};

const LeaderboardCard: React.FC<{
  position: number;
  player: {
    name: string | null;
    image: string | null;
    score: number;
    titleId: number | null;
  };
}> = ({ position, player }) => {
  const { data: profile } = api.user.getProfile.useQuery();

  return (
    <motion.div
      custom={position}
      initial={{ opacity: 0, x: -100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.75 * (5 - position),
          duration: 0.75,
          ease: "backInOut",
        },
      }}
      key={position}
    >
      <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-6 py-4 shadow transition-all hover:translate-y-1">
        <div className="flex items-center justify-center gap-4">
          <div className="text-lg font-semibold">{positions[position]}</div>
          <Avatar className="h-11 w-11 overflow-hidden shadow-sm">
            {player.image && <AvatarImage src={player.image} />}
            <AvatarFallback>{player.name?.at(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-between">
            <p className="font-bold">{player.name}</p>
            {profile?.titles.find((t) => t.id === player.titleId)?.title && (
              <p>
                {profile?.titles.find((t) => t.id === player.titleId)?.title}
              </p>
            )}
          </div>
        </div>
        <div>{player.score} points</div>
      </div>
    </motion.div>
  );
};

export { Podium, Leaderboard };
