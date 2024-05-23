import Layout from "../layout";
import { api } from "~/utils/api";
import type { RoomWithUsers } from "~/pages/room/[slug]";

const WriterWaitToVote: React.FC<{ roomData: RoomWithUsers }> = ({
  roomData,
}) => {
  return <Layout>you wrote definition! Wait to vote</Layout>;
};

export default WriterWaitToVote;
