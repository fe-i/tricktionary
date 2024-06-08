import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

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
    <div className="mt-8 grid h-28 grid-flow-col-dense content-end items-end justify-center gap-2">
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
    <div className="flex flex-col place-content-center">
      <motion.div
        custom={position}
        initial="hidden"
        animate="visible"
        variants={{
          visible: () => ({
            opacity: 1,
            transition: {
              delay: 1 + (5 - position + 1),
              duration: 1,
            },
          }),
          hidden: { opacity: 0 },
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
        initial="hidden"
        animate="visible"
        variants={{
          visible: () => ({
            height: 200 * ((5 - position) / 5),
            opacity: 2,
            transition: {
              delay: 5 - position,
              duration: 1,
              ease: "backInOut",
            },
          }),
          hidden: { opacity: 0, height: 0 },
        }}
        className={cn(
          `opacity-[${0.1 + ((5 - position) / 5) * 2}]`,
          "flex w-16 justify-center rounded-t-xl border-secondary bg-primary shadow transition-all hover:bg-primary/90",
        )}
      >
        <span className="self-end font-semibold text-white">
          {positions[position]}
        </span>
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
      initial="hidden"
      animate="visible"
      variants={{
        visible: () => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: "backInOut",
          },
        }),
        hidden: { opacity: 0, y: -100 },
      }}
      key={position}
    >
      <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-6 py-4 shadow transition-all hover:translate-y-1 hover:bg-accent/50">
        <div className="flex items-center justify-center gap-4">
          <div className="text-lg">{positions[position]}</div>
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
