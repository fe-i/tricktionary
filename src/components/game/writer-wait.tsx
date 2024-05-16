import Layout from "../layout";
import { api } from "~/utils/api";
import type { RoomWithUsers } from "~/pages/room/[slug]";

const WriterWait: React.FC<{ roomData: RoomWithUsers }> = ({ roomData }) => {
  return <Layout></Layout>;
};

export default WriterWait;
