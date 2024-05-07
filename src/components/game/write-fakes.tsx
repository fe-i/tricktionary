import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "../layout";

const WriteFakes: React.FC = () => {
  const router = useRouter();

  const slug = router.query.slug?.toString() ?? "";
  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;

  return (
    <Layout>
      <p>Your word is</p>
      <h2>{roomData?.word}</h2>
    </Layout>
  );
};

export default WriteFakes;
