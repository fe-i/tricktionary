import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";

const Slug: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: sessionData } = useSession();

  // Query room using slug
  const { rounds, difficulty, players, hostId } = {
    rounds: 5,
    difficulty: "Medium",
    players: ["Santiago", "Fei", "Zhi Heng"],
    hostId: "ajs",
  };

  const isOwner = sessionData?.user.id === hostId;

  return (
    <Layout>
      <div className="flex w-full flex-col items-start justify-start gap-3 px-2 py-4">
        <h1 className="text-4xl font-bold">#{slug}</h1>
        <p className="text-lg font-medium">
          {rounds} rounds • {difficulty} difficulty • {players.length} players
        </p>
        <hr className="border-text my-2 w-full" />
        <div className="flex w-full flex-wrap justify-center gap-5">
          {players.map((player, i) => (
            <div className="border-text rounded-lg border px-6 py-3" key={i}>
              <p className="text-lg">{player}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Slug;
