import Layout from "../layout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const WriterWait: React.FC = () => {
  const router = useRouter();

  const slug = router.query.slug?.toString() ?? "";
  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });
  const roomData = roomQuery.data;
  return <Layout></Layout>;
};

export default WriterWait;
